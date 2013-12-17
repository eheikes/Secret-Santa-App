# The Secret Santa Dojo Challenge - [dsmwebgeeks.com](http://www.dsmwebgeeks.com/2013/12/10/december-16th-dojo-secret-santa/)

Secret Santa is a Christmas tradition in which members of a group or community are randomly assigned a person to whom they anonymously give a gift. --Source [WikiPedia](http://en.wikipedia.org/wiki/Secret_Santa)

This is a [Dojo](http://codingdojo.org/cgi-bin/wiki.pl?WhatIsCodingDojo) challenge designed to hone your skills in app development.

## Installation

### Requirements

* [Node.js](http://nodejs.org/) and NPM (should come with)
* [Compass](http://compass-style.org/) (`gem install compass`)
* a [Firebase](https://www.firebase.com/) account (if you want to use your own)

### Build

```
npm install
bower install
grunt
```

### Run

```
grunt server
```

## Scope (project requirements)

* This Secret Santa app should allow a user to **manage** his/her own secret Santa event via a **web interface**. Managing an event entails: keeping track of Secret Santas and who they are **assigned to** give a gift to, coordinating **time** of the event and also randomly **assigning** Secret Santas.
* The Secret Santa manager defines the **parameters** around the event such as **who is involved**, what the **price limit** on the gifts is, **time and date** of the event, and the **assignment** of the Secret Santas.

### Optional

* Gift giving is hard. It might be nice if participants could give some ideas on what gifts they would like to receive, and what their favorite gift of all-time was.
* The ultimate Secret Santa app would automatically assigns Secret Santas and alert each group member of their secret responsibilities.

### FYI:

* You may need a database to store information
* The algorithm to assign Secret Santas needs to avoid duplicates
* It would be awesome if the app was a responsive design (bonus points for using Phone Gap)
* At some point you'll probably want to set up a server to run your code
* If the development side of this is too challenging, just make it look good
