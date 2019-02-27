This project is a template for creating an flask/react application.

It's has a simple ReactJS front that loads a model via Flask.
The model only contains 'title', which the app displays on the front screen.

The web-service protocol has:
* responses must be of the form: { 'status': ...., 'result': ...}
  * The 'status' is a string that can be anything. , by 
  * All flask routes use json_response(status, response) to create the appropriate structure.
  * Sessions.js/apiFetch:
    * only considers 'success' is as a successful request.
    * Wraps http errors in the same response format, with the status == 'error' and result == the request error.
  

It requires (or should have)
* python3
* [mkvirtualenvwrapp](https://virtualenvwrapper.readthedocs.io/en/latest/install.html) for the python server
* [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm):
 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

There is a .idea/ directory for PyCharm.

To use:
* Clone this repository to a directory of your choice.
* <pre>source setup.sh</pre> (Work in progress)


