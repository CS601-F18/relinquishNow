# Requirements:
   1. To develop a web application which could help the homeless to gather resources in need.
   2. Users with excess(Helper) goods update information of items at a particular location
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
 - Supported API
    - User
        1. getUser/<userId>
        2. updateUser/<userId>
        3. getUserItems/<userId>
        4. getUserNotifications/<userId>
        5. getUserAllMessages/<userId>
    - Items
        1. addItem/<itemObj>
        2. updateItem/<itemId>

    - Search
        1. findItem/<string>
        2. 
    - Message
        1. sendMessage/<messageId>
        2. getMessage/<messageid>

# Frontend 
 - ReactNative

# Search
 - Index items in an inverted Index preferably Solr/ Elastic Search 