# SP FRIEND MANAGEMENT

This project is a simple friend management system where you can create friend connections, retrieve friends, retrieve common friends list, subscribe to updates, block updates, retrieve all emails that can receive updates. 

# Introduction
I coded it in Javascript (NodeJS) and used MongoDB as the database to store information mainly because 1) I know it best and time is pressing, 2) it is faster to setup and even though the data is relational, MongoDB can achieve the same outcome. If I had more time and it would be used in the future for long term projects, I would have chosen SQL.

The unit tests are written using the JS framework **Mocha** with the assertion library, **Chai**.

# Usage

Clone the git repository and `npm install`. 
I used Docker-compose so download `Docker-compose` and use the command `docker-compose up`

To see if the tests pass, run `npm test` and `npm run eslint`

# API end points

## create_friend
Creates a friend connection between 2 people.

Makes use of a POST request where the endpoint is `/api/create_friend`.

**Input**: 
```
{
  friends:
    [
      'andy@example.com',
      'john@example.com'
    ]
}
```
If successful, will return `success: true`

## retrieve_friends
Retrieves a friend from a given email address.

Makes use of a GET request where the endpoint is `/api/retrieve_friends`.

**Input**: 
```
/api/retrieve_friends?email=andy@example.com
```
If successful, will return:

```
{
  "success": true,
  "friends" :
    [
      'john@example.com'
    ],
  "count" : 1   
}
```

## retrieve_common_friends

Retrieves a list of common friends from 2 given email addresses.

Makes use of a GET request where the endpoint is `/api/retrieve_common_friends`.

**Input**: 
```
/api/retrieve_common_friends?friends=andy@example.com&friends=john@example.com'

```
If successful, will return:

```
{
  "success": true,
  "friends" :
    [
      'common@example.com'
    ],
  "count" : 1   
}
```

## subscribe_updates
Allows an email to subscribes to update to another email address.

Makes use of a POST request where the endpoint is `/api/subscribe_updates`.

Input: 
```
{
  "requestor": "lisa@example.com",
  "target": "john@example.com"
}
```
If successful, will return:

```
{
  "success": true
}
```

## block_updates_connections
Allows an email to block updates from another email address.

Makes use of a POST request where the endpoint is `/api/block_updates_connections`.

Input: 
```
{
  "requestor": "andy@example.com",
  "target": "john@example.com"
}
```
If successful, will return:

```
{
  "success": true
}
```


## retrieve_all_connections_from_email
List all email addresses which are friends of, or are subscribed to an email address, with exception of those which are blocked.

The reason why I used a POST request for this is because there is a maximum URL length of 2048 for GET requests. So, there is a possibility of the text property in the input breaching the limitation, hence I used a POST request.

Makes use of a POST request where the endpoint is `/api/retrieve_all_connections_from_email`.

Input: 
```
{
  "sender":  "john@example.com",
  "text": "Hello World! kate@example.com"
}
```
If successful, will return:

```
{
  "success": true
  "recipients":
    [
      "lisa@example.com",
      "kate@example.com"
    ]
}
```