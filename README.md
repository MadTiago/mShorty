# mShorty - Url shortener

#
### Configuration
Create a .env file with the following configurations:

| Setting     	| Example                                          	|
|-------------	|--------------------------------------------------	|
| PORT        	| 1337                                             	|
| MONGODB_URI 	| mongodb://[USER:PASS]@localhost[:27017]/DATABASE 	|

#
### Endpoints

| Endpoint 	| Method 	| Description                      	    |
|----------	|--------	|----------------------------------	    |
| /:alias   | GET    	| Get short url by alias and redirect 	|
| /url     	| POST   	| Create short url                 	    |

The **content-type** accepted is **application/json** for all endpoints.

* /:id\
:id = alias for the short url
<br/>

* /url\
Request body
```
{
  url: http://google.com
  alias: google
}
```
url is **required**\
alias is *optional* (In case this field is empty, a random alias will be generated for the url)
