# Requirements:
   1. To develop a web application which could help the homeless to gather resources in need.
   2. Users with excess(Helper) goods update information of items they are relinquishing at a particular location
   3. Items are indexed based on location of item and item types
   4. Users with need of goods(Needer) will search for relevant items and request for item from a particular user.
   5. Helper gets a notification that his item is requested and approves the request
   6. Needer gets a notification that item requested is approved along with exact address of item pickup.

# Instance
    1. Use AWS/Microcloud for sample development of application
    2. Use S3 to store all uploaded files

# Web Server
 - Nginx

# Application Server
 - uWSGI

# Backend API
 - Django REST Framework
 - Supported API. All API take and return JSON response
    - User
        1. api/users/ - GET - return a list of all users
        2. api/users/ - POST - adds a user
        3. api/users/<< userId >>/ - GET - returns user detail with userId
        4. api/users/<< userId >>/ - PUT - updates user detail for a given userId
        5. api/users<< userId >>/itemsPosted/ - GET - returns the list of items user has posted
        6. api/users/<< userId >>/itemsPosted/ - POST - adds an item to list of items user posted
        7. api/users/<< userId >>/itemsRequested/ - GET - returns the list of items user has requested
        8. api/users/<< userId >>/itemsRequested/ - POST - adds an item to the list of items user has requested
        
    - Items
        1. api/items/ - GET - returns a list of all items posted
        2. api/items/<< itemId >>/ - GET - returns a particular item with the itemid
        3. api/items/<< itemId >>/requests/ - GET - get list of requests for the item posted

    - Search
        1. findItem/<string>

    - Message
        1. sendMessage/<< messageId >>/
        2. getMessage/<< messageid >>/

# Frontend 
 - JQuery

# Search
 - Index items in an inverted Index preferably Solr/ Elastic Search 