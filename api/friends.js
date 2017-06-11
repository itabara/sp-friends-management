const express = require("express");
const common = require("../common");
const async = require("async");

const router = express.Router();

let db;
common.on("connected", function() {
	db = common.db;
});

router.post('/create_friend', function(req, res, next) {
	if (!req.body.friends || req.body.friends.length != 2) {
		next(new Error('Please provide 2 emails to create a friend connection'));
	} else {
		let friends = req.body.friends;
		async.each(friends,
			function(friend, callback){
				let index = friends.indexOf(friend);
				let connection = index === 0 ? 1 : 0;
				db.collection('sp-friends').findOne({ "_id": friends[index] }, function(err, person) {
					if ( err ) {
						next(new Error(err));
					}
					if (person === null) {
						db.collection('sp-friends').insertOne({
							'_id': friends[index],
							'connections': [friends[connection]]
						}, function( err, result ) {
							if ( err ) { next(new Error(err)); }
							else { callback(); }
						});
					} else {
						if (person.connections.indexOf(friends[connection]) === -1) {
							person.connections.push(friends[connection]);
						}
						db.collection('sp-friends').update(
							{ _id : friends[index] },
							{ $set : { connections: person.connections } },
							function( err, result ) {
								if ( err )
								{ next(new Error(err)); }
								else { callback(); }
							}
						);
					}
				});
			},
			function(err){
				if ( err )
				{ throw err; }
				res.json({ 'success':true });
			}
		);
	}
});

router.get('/retrieve_friends', function(req, res, next) {
	if (req.query.email) {
		db.collection('sp-friends').findOne({ "_id": req.query.email }, function(err, person) {
			if ( err ) { next(new Error(err)); }
			let details = {
				"success": true,
				"friends" : person.connections,
				"count": person.connections.length
			}
			res.json(details);
		});
	} else {
		next(new Error("Please provide an email in the url."));
	}
});

router.get('/retrieve_common_friends', function(req, res, next) {
	if (!req.query.friends || req.query.friends.length != 2) {
		next(new Error('Please provide 2 emails to retrieve common friends'));
	} else {
		let friends = req.query.friends;
		db.collection('sp-friends').find({ "_id": { $in : [friends[0], friends[1]] } }).toArray(function(err, persons) {
			if ( err ) { next(new Error(err)); }
			var repeatedConnections = [], commonConnections = [],
			firstPersonConnections = persons[0].connections,
			secondPersonConnections = persons[1].connections;

			firstPersonConnections.forEach(function(connection) {
				repeatedConnections[connection] = true;
			})
			secondPersonConnections.forEach(function(connection) {
				if (repeatedConnections[connection]) {
					commonConnections.push(connection);
				}
			})
			let details = {
				"success": true,
				"friends": commonConnections,
				"count": commonConnections.length
			}
			res.json(details);
		});
	}
});

router.post('/subscribe_updates', function(req, res, next) {
	if (!req.body.requestor || !req.body.target) {
		next(new Error('Please provide a requestor and a target.'));
	} else {
		db.collection('sp-friends').findOne({ "_id": req.body.target }, function(err, person) {
			if ( err ) { next(new Error(err)); }
			person.followers = person.followers ? person.followers : [];
			if (person.followers.indexOf(req.body.requestor) === -1) {
				person.followers.push(req.body.requestor);
			}
			db.collection('sp-friends').update(
				{ _id : req.body.target },
				{ $set : { followers: person.followers } },
				function( err, result ) {
					if ( err )
					{ next(new Error(err)); }
					else { res.json({ 'success':true }); }
				}
			);
		});
	}
});

router.post('/block_updates_connections', function(req, res, next) {
	if (!req.body.requestor || !req.body.target) {
		next(new Error('Please provide a requestor and a target.'));
	} else {
		db.collection('sp-friends').findOne({ "_id": req.body.target }, function(err, person) {
			if ( err ) { next(new Error(err)); }
			person.blockedBy = person.blockedBy ? person.blockedBy : [];
			if (person.blockedBy.indexOf(req.body.requestor) === -1) {
				person.blockedBy.push(req.body.requestor);
			}
			db.collection('sp-friends').update(
				{ _id : req.body.target },
				{ $set : { blockedBy: person.blockedBy } },
				function( err, result ) {
					if ( err )
					{ next(new Error(err)); }
					else { res.json({ 'success':true }); }
				}
			);
		});
	}

});

router.post('/retrieve_all_connections_from_email', function(req, res, next) {
	if (!req.body.sender || !req.body.text) {
		next(new Error('Please provide a sender and a text.'));
	} else {
		db.collection('sp-friends').findOne({ "_id": req.body.sender }, function(err, person) {
			let peopleWhoCanReceiveUpdates = {};
			let peopleWhoCanReceiveUpdatesAfterBlocked = [];
			if (person.connections) {
				person.connections.forEach(function(connection) {
					peopleWhoCanReceiveUpdates[connection] = true;
				});
			}
			if (person.followers) {
				person.followers.forEach(function(follower) {
					peopleWhoCanReceiveUpdates[follower] = true;
				});
			}
			if (person.blockedBy) {
				person.blockedBy.forEach(function(blockedPerson) {
					if (peopleWhoCanReceiveUpdates[blockedPerson]) {
						delete peopleWhoCanReceiveUpdates[blockedPerson];
					}
				});
			}

			var peopleMentioned = req.body.text.match(/\S+[a-z0-9]@[a-z0-9\.]+/img);
			peopleMentioned.forEach(function(mentionedPerson) {
					peopleWhoCanReceiveUpdates[mentionedPerson] = true;
			});

			for (var key in peopleWhoCanReceiveUpdates) {
				peopleWhoCanReceiveUpdatesAfterBlocked.push(key);
			}

			let details = {
				"success": true,
				"recipients": peopleWhoCanReceiveUpdatesAfterBlocked,
				"count": peopleWhoCanReceiveUpdatesAfterBlocked.length
			}
			res.json(details);
		});
	}
});

module.exports = router;
