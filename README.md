# Chat_Archive_Application - REACT Branch
This branch will be our test grounds as we begin to implement the React Library

A Node JS chat application that archives messages that have been exchanged by users.

	Worked on by:

	- Jerome Ching: 100530184
	- Morgan Gill: 100566959
## Routes
### Chat Related API
Route|Method| What it does
-----|------|--------------
 /chat/newMessage |POST| If post data is valid, saves to database
 /chat/messages |GET| returns all Messages
 /chat/messages/:id |GET| returns all messages related to specified User id
 /chat/rooms	|GET| returns list of rooms (we could probably leave this one out?)
 /chat/rooms/:id |GET| returns all messages associated with specified Room ID
### Event Related API
Route|Method| What it does
-----|------|-------------
/events		|GET| returns all events
/events/newEvent	|POST|If post data is valid, save to database

#### Notes:
The documentation and changes to the API is mostly to make it more consistent.

## Components
The below is more of a checklist for what we want to accomplish
### Navigation Bar
 - [ ] Visible at all times
 - [ ] Links will change content that is displayed
   - Guests will only see a logo or title.  Maybe move the current username and room number up there?
   - No navigation for administrator
 - [ ] Login button for Admin access
   - Changes to logout if admin is logged in.
### Main Page
 - [ ] Primary page containing the client-side chat application
 - [ ] User defines their username and chat-room before seeing the chatroom
### Admin Section
 - [ ] Has a horizontal list of links for different views
 - [ ] Inner div.container that changes views based on selected link
#### Admin Subsections...
Elaborate on this later.
