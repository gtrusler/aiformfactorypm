Title: External data

URL Source: https://docassemble.org/docs/external.html

Markdown Content:
*   [1 URL arguments](https://docassemble.org/docs/external.html#url_args)
*   [2 Using the “actions” system](https://docassemble.org/docs/external.html#actions)
    *   [2.1 Pushing information into a session](https://docassemble.org/docs/external.html#push)
    *   [2.2 Pulling information out of a session](https://docassemble.org/docs/external.html#pull)
*   [3 Using the API](https://docassemble.org/docs/external.html#api)
*   [4 E-mail](https://docassemble.org/docs/external.html#emailfrom)
    *   [4.1 Sending e-mail from a session](https://docassemble.org/docs/external.html#emailfrom)
    *   [4.2 Sending e-mail to a session](https://docassemble.org/docs/external.html#emailto)
*   [5 Sending text messages from a session](https://docassemble.org/docs/external.html#sms)
*   [6 Persisting data](https://docassemble.org/docs/external.html#persistdata)
    *   [6.1 Persistent interview sessions](https://docassemble.org/docs/external.html#persistsessions)
    *   [6.2 Persistent files](https://docassemble.org/docs/external.html#persistfiles)
    *   [6.3 Saving to SQL](https://docassemble.org/docs/external.html#sql)
    *   [6.4 Saving to Redis](https://docassemble.org/docs/external.html#redis)
*   [7 Using third-party APIs](https://docassemble.org/docs/external.html#thirdpartyapi)
*   [8 Sharing information across sessions](https://docassemble.org/docs/external.html#acrosssessions)

There are a variety of ways that you can move information into and out of interview sessions, besides obtaining information from the user.

URL arguments[¶](https://docassemble.org/docs/external.html#url_args)
---------------------------------------------------------------------

As explained in the [invocation](https://docassemble.org/docs/interviews.html#invocation) section, when a user starts an interview, the user visits a URL. This URL can contains parameters of your own choosing (as long as the names do not conflict with any of the [reserved URL parameters](https://docassemble.org/docs/special.html#reserved%20url%20parameters)). Data passed using these parameters is available inside the interview session using the [`url_args` special variable](https://docassemble.org/docs/special.html#url_args).

You can also change the [`url_args`](https://docassemble.org/docs/special.html#url_args) during an active interview session. If the user’s browser is logged into a session, and the user clicks on a hyperlink to the same interview with URL parameters set, the [`url_args`](https://docassemble.org/docs/special.html#url_args) will be updated.

Using the “actions” system[¶](https://docassemble.org/docs/external.html#actions)
---------------------------------------------------------------------------------

The normal flow of an interview in **docassemble** is as follows:

1.  The screen loads, and the user sees whatever [`question`](https://docassemble.org/docs/questions.html#question) is the next step in the [interview logic](https://docassemble.org/docs/logic.html), given the current state of the interview answers.
2.  The user enters some information (if the screen asks for information) and then presses a button.
3.  The interview answers are updated with the new information.
4.  Go back to step 1.

Eventually, the interview will reach a logical endpoint. This flow makes sense for the main path of the interview, but sometimes the user needs to deviate from the main path. For example, they might want to adjust their answers to previous questions.

In **docassemble**, “actions” are used to trigger deviations from the main path of the [interview logic](https://docassemble.org/docs/logic.html). For example, suppose that under the main path of the [interview logic](https://docassemble.org/docs/logic.html), the next piece of information that is necessary to gather is `favorite_legume`. The interview will show a [`question`](https://docassemble.org/docs/questions.html#question) that offers to define `favorite_legume`. But suppose you want the user to be able to go back to the `favorite_vegetable` question. (Perhaps a common mistake is for users to list a legume as their favorite vegetable). You can allow the user to launch an “action” that causes the interview to seek (or in this case, re-seeks) the variable `favorite_vegetable` instead of the variable `favorite_legume`.

```
question: |
  What is your favorite legume?
subquestion: |
  You said your
  [favorite vegetable](${ url_action('favorite_vegetable') })
  was
  ${ favorite_vegetable }.
fields:
  Legume: favorite_legume
```

For more information about “actions,” see the documentation for [`url_action()`](https://docassemble.org/docs/functions.html#url_action) and [`url_ask()`](https://docassemble.org/docs/functions.html#url_ask).

Another type of deviation from the main interview logic is a [background action](https://docassemble.org/docs/background.html#background). This is where some code runs on the server, in the background, where the user can’t see anything. This is typically used for code that takes a long time to run, where you don’t want the user to have to wait for the result, or there is a danger that the user’s browser will time out if the server does not respond quickly enough.

Pushing information into a session[¶](https://docassemble.org/docs/external.html#push)
--------------------------------------------------------------------------------------

Typically, users launch actions by clicking hyperlinks within the **docassemble** application. However, it is also possible to click hyperlinks outside of the application that run actions inside the session.

For more information about this feature, see the [`interview_url_action()`](https://docassemble.org/docs/functions.html#interview_url_action) function. This function creates a URL that embeds the session ID.

Pulling information out of a session[¶](https://docassemble.org/docs/external.html#pull)
----------------------------------------------------------------------------------------

The [`interview_url_action()`](https://docassemble.org/docs/functions.html#interview_url_action) function also allows the extraction of information from an interview. You can call [`interview_url_action()`](https://docassemble.org/docs/functions.html#interview_url_action) with a reference to an [`event`](https://docassemble.org/docs/fields.html#event) that runs [`json_response()`](https://docassemble.org/docs/functions.html#json_response) to return selected information in a machine-readable format. This allows you to create a customizable “API” for your interview.

```
objects:
  - user: Individual
---
mandatory: True
code: |
  multi_user = True
---
event: query_fruit
code: |
  data = {'fruit': favorite_fruit, 'pieces': number_of_pieces}
  json_response(data)
---
mandatory: True
question: |
  You currently have
  ${ nice_number(number_of_pieces) }
  ${ noun_plural('piece', number_of_pieces) }
  of
  ${ noun_singular(favorite_fruit) }.
subquestion: |
  Use
  [this link](${ interview_url_action('query_fruit') })
  to query the information from
  another application.

  You can also change the 
  [fruit](${ url_action('favorite_fruit') })
  and the
  [number of pieces](${ url_action('number_of_pieces') }).
```

[![Image 5: Screenshot of response-json example](https://docassemble.org/img/examples/response-json.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/response-json.yml&reset=1 "Click to try this interview")

If you go through the interview and obtain the URL, you can try loading it in a different browser to verify that another application (not having the same browser cookies) can access the information in [JSON](https://en.wikipedia.org/wiki/JSON) format.

Using the API[¶](https://docassemble.org/docs/external.html#api)
----------------------------------------------------------------

You can also manipulate interview sessions using the **docassemble** [API](https://docassemble.org/docs/api.html).

E-mail[¶](https://docassemble.org/docs/external.html#emailfrom)
---------------------------------------------------------------

Sending e-mail from a session[¶](https://docassemble.org/docs/external.html#emailfrom)
--------------------------------------------------------------------------------------

You can use the [`send_email()`](https://docassemble.org/docs/functions.html#send_email) function to send e-mails from an interview session to the outside world. You will first need to [configure your server](https://docassemble.org/docs/config.html#mail) to send e-mail.

Sending e-mail to a session[¶](https://docassemble.org/docs/external.html#emailto)
----------------------------------------------------------------------------------

If you are using [Docker](https://docassemble.org/docs/docker.html) to deploy your server, and you have [configured your server to receive e-mail](https://docassemble.org/docs/config.html#setup_email), you can use **docassemble**’s e-mail-to-session feature.

This involves generating a special e-mail address using [`interview_email()`](https://docassemble.org/docs/functions.html#interview_email). Any e-mails sent to that address and received by the server will be processed and made available in the interview session for retrieval using [`get_emails()`](https://docassemble.org/docs/functions.html#get_emails).

Sending text messages from a session[¶](https://docassemble.org/docs/external.html#sms)
---------------------------------------------------------------------------------------

You can use the [`send_sms()`](https://docassemble.org/docs/functions.html#send_sms) function to send text messages from an interview session to the outside world. You will first need to [configure your server](https://docassemble.org/docs/config.html#twilio) to send text messages. Despite the function name (“SMS”), this function can be used to send messages through [Twilio](https://twilio.com/)’s [WhatsApp API](https://www.twilio.com/whatsapp).

Persisting data[¶](https://docassemble.org/docs/external.html#persistdata)
--------------------------------------------------------------------------

Persistent interview sessions[¶](https://docassemble.org/docs/external.html#persistsessions)
--------------------------------------------------------------------------------------------

The interview answers in an interview session are stored in encrypted form inside of rows in a [SQL](https://en.wikipedia.org/wiki/SQL) table. Documents are stored on the server or in a cloud storage system. If a user who is not logged in completes an interview, they will not be able to access their interview session again after closing their browser, because the encryption key will be lost. However, if they log in, their interview session will be tied to their account, and their password will become the decryption key for the session.

The encryption of interview answers makes it impossible for someone other than the original user to access the data in the interview session, unless the decryption key (the user’s password) is known. However, if the interview sets [`multi_user`](https://docassemble.org/docs/special.html#multi_user) to `False`, then functions like [`interview_url_action()`](https://docassemble.org/docs/functions.html#interview_url_action) can be used to access the data in the interview as long as the interview session exists.

By default, interview sessions are deleted after 90 days of inactivity. This feature can be modified or turned off using the [`interview delete days`](https://docassemble.org/docs/config.html#interview%20delete%20days) configuration directive.

Persistent files[¶](https://docassemble.org/docs/external.html#persistfiles)
----------------------------------------------------------------------------

When an interview session is deleted, the files associated with the interview session are also deleted.

If you want a file to continue exist after its associated interview session has been deleted, you can use the [`.set_attributes()`](https://docassemble.org/docs/objects.html#DAFile.set_attributes) method of the [`DAFile`](https://docassemble.org/docs/objects.html#DAFile) object in order to indicate that the file should not be deleted when the interview session is deleted.

Saving to SQL[¶](https://docassemble.org/docs/external.html#sql)
----------------------------------------------------------------

A session’s interview answers are stored in a [SQL](https://en.wikipedia.org/wiki/SQL) server, but not in a way that is easily accessible across interview sessions. Interview sessions are not persistent; the user can delete a session, and a session may be deleted due to inactivity (unless the [``` interview delete days ```](https://docassemble.org/docs/config.html#interview%20delete%20days) configuration directive is set to disable automatic deletion).

If you want to save information in [SQL](https://en.wikipedia.org/wiki/SQL) in a way that will persist indefinitely and that will not be encrypted, you can use the [`store_variables_snapshot()`](https://docassemble.org/docs/functions.html#store_variables_snapshot) function to store the interview answers to a special [SQL](https://en.wikipedia.org/wiki/SQL) table in a [JSON](https://en.wikipedia.org/wiki/JSON) format that allows you to write [SQL](https://en.wikipedia.org/wiki/SQL) queries that access individual variables inside the data structure. You can also use [`write_record()`](https://docassemble.org/docs/functions.html#write_record), [`delete_record()`](https://docassemble.org/docs/functions.html#delete_record) and [`read_records()`](https://docassemble.org/docs/functions.html#read_records) functions to store data (including Python objects) in [SQL](https://en.wikipedia.org/wiki/SQL) records. These methods do not preserve server-side encryption, however.

You can save information in encrypted form in [SQL](https://en.wikipedia.org/wiki/SQL) in a [Redis](https://redis.io/)\-like fashion using a [`DAStore`](https://docassemble.org/docs/objects.html#DAStore) object.

It is also possible for [`DAObject`](https://docassemble.org/docs/objects.html#DAObject)s to “mirror” rows in a [SQL](https://en.wikipedia.org/wiki/SQL) database. To do this, you need to write custom classes that are subclasses of [`DAObject`](https://docassemble.org/docs/objects.html#DAObject) and the special object [`SQLObject`](https://docassemble.org/docs/objects.html#SQLObject). For more information, see the documentation for [`SQLObject`](https://docassemble.org/docs/objects.html#SQLObject).

Saving to Redis[¶](https://docassemble.org/docs/external.html#redis)
--------------------------------------------------------------------

Instead of saving to the [SQL](https://en.wikipedia.org/wiki/SQL) database, you can write persistent data to [Redis](https://redis.io/) using an instance of the [`DARedis`](https://docassemble.org/docs/objects.html#DARedis) object.

Using third-party APIs[¶](https://docassemble.org/docs/external.html#thirdpartyapi)
-----------------------------------------------------------------------------------

Your interview can also communicate with the outside world using any [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) module that provides the functionality you want.

Here is a simple example that calls the [World Clock API](http://worldclockapi.com/) to obtain the current time (which you don’t really need an API to do).

The API call is in a [Python module](https://docs.python.org/3/tutorial/modules.html) called [`gettime.py`](https://github.com/jhpyle/docassemble/blob/master/docassemble_demo/docassemble/demo/gettime.py) in the [`docassemble.demo`](https://github.com/jhpyle/docassemble/tree/master/docassemble_demo/docassemble/demo) package. The contents of this file are:

```
import requests

def get_time():
    r = requests.get('http://worldclockapi.com/api/json/est/now')
    if r.status_code != 200:
        raise Exception("Could not obtain the time")
    return r.json()['currentDateTime']
```

The [World Clock API](http://worldclockapi.com/) returns output in [JSON](https://en.wikipedia.org/wiki/JSON) format, such as:

```
{"$id":"1","currentDateTime":"2019-03-04T22:43-05:00","utcOffset":"-05:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Monday","timeZoneName":"Eastern Standard Time","currentFileTime":131962129911877536,"ordinalDate":"2019-63","serviceResponse":null}
```

The `get_time()` function uses the [`requests`](https://requests.readthedocs.io/en/master/) library. The variable `r` represents the response of the [World Clock API](http://worldclockapi.com/)’s server to the attempt to your code’s attempt to obtain the contents of the given URL. This object has a handy method `.json()` that converts the output of the request to a data structure, assuming that the request returns [JSON](https://en.wikipedia.org/wiki/JSON). The `get_time()` function returns the `currentDateTime` part of the [World Clock API](http://worldclockapi.com/)’s response.

Here is an interview that calls the `get_time()` function:

```
modules:
  - docassemble.demo.gettime
---
mandatory: True
question: |
  The time
subquestion: |
  According to the World Clock API, the
  current time in the Eastern time zone is
  ${ get_time() }.
```

[![Image 6: Screenshot of get-time example](https://docassemble.org/img/examples/get-time.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/get-time.yml&reset=1 "Click to try this interview")

For more complex examples, see the [sample interviews in the documentation](https://docassemble.org/docs/functions.html#google%20sheets%20example) that read data from a [Google Sheet](https://sheets.google.com/) and write data to a [Google Sheet](https://sheets.google.com/).

Sharing information across sessions[¶](https://docassemble.org/docs/external.html#acrosssessions)
-------------------------------------------------------------------------------------------------

Users’ answers to questions in an interview are stored in the “interview answers,” which is a pickled Python dictionary stored on the [SQL](https://en.wikipedia.org/wiki/SQL) server. Each set of “interview answers” is specific to a particular interview (e.g., `docassemble.demo:data/questions/questions.yml`) and specific to a particular session in that interview (e.g., session ID `BoJSwJHppIPFYtFEOeBU1y4koaM3L9zP`).

Every time the user proceeds from one screen to another, the interview answers are changed, the interview logic is evaluated (which may change the interview answers further) and a new set of interview answers is saved. The user can incrementally “undo” changes to the interview answers by pressing the “back” button, which restores an earlier saved state of the interview answers.

**docassemble**’s interview logic system is based on this system of the “interview answers.” If the interview logic calls for a value of a variable that is undefined, **docassemble** will ask a `question` or run `code` to obtain a definition of that variable. **docassemble** asks for information that is missing in the interview answers.

By default, the interview answers are encrypted on the server and can only be accessed when the user provides the decryption key via a web browser cookie. This gives the user control over their information.

The way that **docassemble** works with interview answers is very different from the way that a typical web-based database works with data. A web-based database will typically use a [SQL](https://en.wikipedia.org/wiki/SQL) backend, where the front end allows the user to populate fields of data records, where the fields are columns and the data records are rows in [SQL](https://en.wikipedia.org/wiki/SQL) tables. These applications are known as “[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)” applications, because the front end facilitates creating, retrieving, updating, and deleting rows in tables. In **docassemble**, by contrast, the interview answers are not values in two-dimensional data tables, but rather Python data structures that at any point in time may be only be partially populated.

If you want to share information across sessions, you can do so, but the methods for doing so are not going to be the same as the methods for accessing data in a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) application.

There are multiple ways that you can share information across sessions:

*   Push data: from session A, you can populate variables in session B by calling [`set_session_variables()`](https://docassemble.org/docs/functions.html#set_session_variables). If session B does not exist yet, you can first initiate it by calling [`create_session()`](https://docassemble.org/docs/functions.html#create_session).
*   Pull data: from session B, you can retrieve variables from session A by calling [`get_session_variables()`](https://docassemble.org/docs/functions.html#get_session_variables).
*   Initialize variables from values stored in a common storage area: from session A, you can use a [`DAStore`](https://docassemble.org/docs/objects.html#DAStore) object to save data to a storage area that is specific to the user but can be accessed from any session. In session B, you can write `code` blocks that initialize variables to values that are stored in that storage area, if the storage area exists. By default, data are encrypted using the same encryption system as interview answers, and encryption can be turned off.
*   Share global variables across sessions: in session A, you can use a [`DAGlobal`](https://docassemble.org/docs/objects.html#DAGlobal) object to store the part of the interview answers you want to share. In session B, you can use a [`DAGlobal`](https://docassemble.org/docs/objects.html#DAGlobal) object with the same “base” and “key,” and the attributes of the object in both sessions will be stored in a common storage area rather than in the interview answers of either session. Encryption is not available with this option.
*   Share data using [Redis](https://redis.io/): [`DARedis`](https://docassemble.org/docs/objects.html#DARedis) can also be used as a storage area. From session A, you can use the [`.set_data()`](https://docassemble.org/docs/objects.html#DARedis.set_data) method of [`DARedis`](https://docassemble.org/docs/objects.html#DARedis) to save a Python data structure to [Redis](https://redis.io/), and then inside of session B, you can call the [`.get_data()`](https://docassemble.org/docs/objects.html#DARedis.get_data) method of [`DARedis`](https://docassemble.org/docs/objects.html#DARedis) to retrieve the data structure. [Redis](https://redis.io/) is a fast, in-memory data storage area, so it is best used with information that only needs to be stored temporarily. Encryption is not available.
*   Share data in a list of records: the [`write_record()`](https://docassemble.org/docs/functions.html#write_record) and [`read_records()`](https://docassemble.org/docs/functions.html#read_records) functions are useful for storing lists of data records, where each list is identified by a key that is global to the server. Inside of session A, you can call [`write_record()`](https://docassemble.org/docs/functions.html#write_record) to store a row in a list. Inside of session B, you can call [`read_records()`](https://docassemble.org/docs/functions.html#read_records) to retrieve all of the records in that list. Encryption is not available.
*   Sync data to a SQL database: if you would like to use a traditional [SQL](https://en.wikipedia.org/wiki/SQL) database as a “single source of truth” for variables in your interview, you can use the [`SQLObject`](https://docassemble.org/docs/objects.html#SQLObject) system. This allows you to “sync” variables in your interview answers with a [SQL](https://en.wikipedia.org/wiki/SQL) database. Encryption is not supported.
*   Stash data temporarily in an encrypted data store: from session A, you can call [`stash_data()`](https://docassemble.org/docs/functions.html#stash_data) to store particular interview answers in an encrypted location. [`stash_data()`](https://docassemble.org/docs/functions.html#stash_data) returns tokens that can be used to access the stashed data. Session A can offer the user URLs to other interviews, in which the tokens are URL parameters. If the user clicks one of these URLs and starts session B, the interview logic in session B can get look for the tokens in `url_args` and call [`retrieve_stashed_data()`](https://docassemble.org/docs/functions.html#retrieve_stashed_data) to retrieve the interview answers that had been stored by session A. The stored data can be deleted once they are retrieved, and can automatically expire after a period of time. This is a secure way to pass data from one session to another. It avoids storing human-readable information in the URL parameters when passing data from one session to a prospective session. It avoids the unnecessary creation of a new session if the user does not want to proceed to start a new session. The encryption system is independent of the encryption system for interview answers, so that knowledge of the tokens does not lead to knowledge of any interview answers. There are [API interfaces](https://docassemble.org/docs/api.html#stash_data) for stashing data and retrieving stashed data.
