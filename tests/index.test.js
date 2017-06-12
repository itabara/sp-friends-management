const path = require('path');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../index');

chai.use(chaiHttp);

describe('SP friend management::Api endpoints', () => {
	it('is located in the right position', () => {
		expect(() => {
			require(path.join(__dirname, '../api/friends.js'))
		}).to.not.throw();
	})

	it('/create_friend::should have a friends field', (done) => {
		let obj = {
			"friends":
				[
					"john@example.com",
					"andy@example.com"
				]
		}
		chai.request(server)
			.post('/api/create_friend')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				done();
			});
	});

	it('/retrieve_friends::should have an email field', (done) => {
		chai.request(server)
			.get('/api/retrieve_friends')
			.query({ email: 'andy@example.com' })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('friends');
				res.body.friends.should.be.a('array');
				res.body.should.have.property('count');
				done();
			});
	});

	it('/retrieve_common_friends::should have a friends field', (done) => {
		chai.request(server)
			.get('/api/retrieve_common_friends')
			.query({ friends: ['andy@example.com', 'john@example.com'] })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('friends');
				res.body.friends.should.be.a('array');
				res.body.should.have.property('count');
				done();
			});
	});
	it('/subscribe_updates::should have a requestor and target field', (done) => {
		let obj = {
			"requestor": "lisa@example.com",
			"target": "john@example.com"
		}
		chai.request(server)
			.post('/api/subscribe_updates')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				done();
			});
	});

	it('/block_updates_connections::should have a requestor and target field', (done) => {
		let obj = {
			"requestor": "andy@example.com",
			"target": "john@example.com"
		}
		chai.request(server)
			.post('/api/block_updates_connections')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				done();
			});
	});

	it('/retrieve_all_connections_from_email::should have a sender and text field', (done) => {
		let obj = {
			"sender":  "john@example.com",
			"text": "Hello World! kate@example.com"
		}
		chai.request(server)
			.post('/api/retrieve_all_connections_from_email')
			.send(obj)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('recipients');
				res.body.recipients.should.be.a('array');
				done();
			});
	});
});