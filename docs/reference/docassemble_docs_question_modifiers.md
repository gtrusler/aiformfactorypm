Title: Question modifiers

URL Source: https://docassemble.org/docs/modifiers.html

Markdown Content:
*   [1 Including audio](https://docassemble.org/docs/modifiers.html#audio)
*   [2 Including video](https://docassemble.org/docs/modifiers.html#video)
*   [3 Providing help text to users](https://docassemble.org/docs/modifiers.html#help)
*   [4 Adding images to question: decoration](https://docassemble.org/docs/modifiers.html#decoration)
*   [5 Adding JavaScript: script](https://docassemble.org/docs/modifiers.html#script)
*   [6 Adding CSS: css](https://docassemble.org/docs/modifiers.html#css)
*   [7 The progress bar](https://docassemble.org/docs/modifiers.html#progress)
*   [8 The section navigation bar](https://docassemble.org/docs/modifiers.html#section)
*   [9 Disable the back button: prevent going back](https://docassemble.org/docs/modifiers.html#preventgoingback)
*   [10 Adding a back button inside the question](https://docassemble.org/docs/modifiers.html#backbutton)
*   [11 Changing the text of the back button](https://docassemble.org/docs/modifiers.html#backbuttonlabel)
*   [12 Vocabulary terms and auto terms](https://docassemble.org/docs/modifiers.html#terms)
*   [13 The language of the question](https://docassemble.org/docs/modifiers.html#language)
*   [14 Changing the continue button label](https://docassemble.org/docs/modifiers.html#continuebuttonlabel)
*   [15 Changing the continue button color](https://docassemble.org/docs/modifiers.html#continuebuttoncolor)
*   [16 Reusable questions: generic object](https://docassemble.org/docs/modifiers.html#genericobject)
*   [17 The role of the question](https://docassemble.org/docs/modifiers.html#role)
*   [18 Automatically reload the screen](https://docassemble.org/docs/modifiers.html#reload)
*   [19 Tag a block with a unique id](https://docassemble.org/docs/modifiers.html#id)
*   [20 Google Analytics IDs](https://docassemble.org/docs/modifiers.html#gaid)
*   [21 Segment IDs](https://docassemble.org/docs/modifiers.html#segmentid)
*   [22 Breadcrumb name](https://docassemble.org/docs/modifiers.html#breadcrumb)
*   [23 Manually indicating that a block sets a variable](https://docassemble.org/docs/modifiers.html#sets)
*   [24 Indicating that a block only sets certain variables](https://docassemble.org/docs/modifiers.html#onlysets)
*   [25 Indicating that a block is permitted to set a variable](https://docassemble.org/docs/modifiers.html#allowedtoset)
*   [26 Changing order of precedence](https://docassemble.org/docs/modifiers.html#precedence)
*   [27 Putting conditions on whether a question is applicable](https://docassemble.org/docs/modifiers.html#if)
*   [28 Conditionally hiding the Continue button based on a Python expression](https://docassemble.org/docs/modifiers.html#hidecontinuebutton)
*   [29 Conditionally disabling the Continue button based on a Python expression](https://docassemble.org/docs/modifiers.html#disablecontinuebutton)
*   [30 Turn off variable scanning](https://docassemble.org/docs/modifiers.html#scanforvariables)
*   [31 Indicate variables that are prerequisites](https://docassemble.org/docs/modifiers.html#need)
*   [32 Indicate prerequisite variables that invalidate a block](https://docassemble.org/docs/modifiers.html#dependson)
*   [33 Undefine variables when a question is asked](https://docassemble.org/docs/modifiers.html#undefine)
*   [34 Obtain new values of variables when a question is asked](https://docassemble.org/docs/modifiers.html#reconsider)
*   [35 Include additional buttons on the screen](https://docassemble.org/docs/modifiers.html#actionbuttons)
*   [36 Hidden comments](https://docassemble.org/docs/modifiers.html#comment)

There are a number of optional modifiers that can be included in [`question`](https://docassemble.org/docs/questions.html#question) blocks to control the appearance or behavior of the question. Some of these can also be applied to other types of blocks that set variables, such as `code` blocks.

Including `audio`[¶](https://docassemble.org/docs/modifiers.html#audio)
-----------------------------------------------------------------------

```
audio: schumann-clip-1.mp3
question: You need to relax.
subquestion: |
  Listen to some Schumann, and then
  proceed.
field: user_is_relaxed
```

[![Image 71: Screenshot of audio example](https://docassemble.org/img/examples/audio.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/audio.yml&reset=1 "Click to try this interview")

The `audio` modifier allows you to add audio to your questions. An audio player will appear above the question, and the user can press play to hear the sound.

The filename can be constructed with [Mako](https://www.makotemplates.org/). A plain file path will be assumed to point to a file in the `static` directory of the package in which the [YAML](https://en.wikipedia.org/wiki/YAML) file resides. A package reference may also be included: e.g., `docassemble.demo:data/static/schumann-clip-3.mp3`. A URL beginning with `http` or `https` may also be provided.

You can also play uploaded files:

```
question: Please record some audio.
fields:
  - MP3 file: user_audio_file
    datatype: file
---
question: |
  Let's listen to what you recorded.
audio: ${ user_audio_file }
mandatory: True
```

[![Image 72: Screenshot of upload_audio example](https://docassemble.org/img/examples/upload_audio.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/upload_audio.yml&reset=1 "Click to try this interview")

Note that in this example, we use `file` as the `datatype`, which is the standard way to upload files. You can also use the `datatype` of [`microphone`](https://docassemble.org/docs/fields.html#microphone), which in some browsers (mostly on mobile platforms) will launch an audio recording app to create the file to upload.

```
question: Please record some audio.
fields:
  - MP3 file: user_audio_file
    datatype: microphone
---
question: |
  Let's listen to what you recorded.
audio: ${ user_audio_file }
mandatory: True
```

[![Image 73: Screenshot of upload_audio_microphone example](https://docassemble.org/img/examples/upload_audio_microphone.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/upload_audio_microphone.yml&reset=1 "Click to try this interview")

**docassemble** uses the [HTML5 audio tag](https://www.w3schools.com/html/html5_audio.asp) to allow users to play the audio. Not all browsers support every type of audio file. In order to make your audio files accessible to the greatest number of users, then if you provide static audio files, you should include files in both `mp3` and `ogg` format.

For example, if your `audio` specifier points to a file, such as `nyc_question.mp3`, then your interview package should contain a file called `nyc_question.mp3` in the `data/static` directory. If you also include an OGG version of this audio file, called `nyc_question.ogg`, in the same directory, then **docassemble** will make both files available to the user, and the user’s browser will use whichever file works. In your `audio` specifier, you can refer to either the `mp3` or the `ogg` file.

Or, if your `mp3` and `ogg` alternatives are located in different directories, you can do this:

```
---
question: Are you traveling to New York City?
yesno: going_to_nyc
audio:
  - mp3/nyc_question.mp3
  - ogg/nyc_question.ogg
---
```

Or, if you are using hyperlinks to files on another server, you can include different versions by doing something like this:

```
---
question: Are you traveling to New York City?
yesno: going_to_nyc
audio:
  - http://example.com/files/audio/51/nyc_question.mp3
  - http://example.com/files/audio/23/nyc_question.ogg
---
```

If you refer to an uploaded file, **docassemble** will take care of providing both `mp3` and `ogg` versions. When users upload an audio file, **docassemble** tries to convert it to the appropriate formats. For this to work, ffmpeg and pacpl must be installed on your system. Currently, **docassemble** can handle audio files uploaded in `mp3`, `ogg`, `3gpp`, and `wav` formats. If you need to be able to process another type of audio file, **docassemble**’s source code can probably be modified to support that audio type.

Note that there a number of limitations to playing audio in browsers. For example, older Android devices will not play audio retrieved through https, but will play the same audio retrieved through http.

See [special variables](https://docassemble.org/docs/special.html) for information about **docassemble**’s automatic text-to-speech features.

Including `video`[¶](https://docassemble.org/docs/modifiers.html#video)
-----------------------------------------------------------------------

The `video` specifier is just like the [`audio`](https://docassemble.org/docs/modifiers.html#audio) specifier except that it displays a video instead of an audio file.

```
---
question: Are you traveling to New York City?
yesno: going_to_nyc
video: nyc_tourism.mp4
---
```

**docassemble** uses the [HTML5 video tag](https://www.w3schools.com/html/html5_video.asp) to allow users to play the audio. Just as you should include both `mp3` and `ogg` audio files, you should include both `mp4` and `ogv` video files, so that users of many different browsers will all be able to see your videos. These are the two formats that the [HTML5 video tag](https://www.w3schools.com/html/html5_video.asp) most widely supports.

If you refer to an uploaded video file, **docassemble** will take care of providing both `mp4` and `ogv` versions. When users upload a video file, **docassemble** tries to convert it to the appropriate formats. For this to work, ffmpeg and pacpl must be installed on your system. Currently, **docassemble** can handle videos uploaded in `mp4`, `ogv`, and `mov` formats. If you need to be able to process another type of video, **docassemble**’s source code can probably be modified to support that video type.

You can also use the `video` specifier to embed [YouTube](https://www.youtube.com/) videos. For example, if you want to embed a [YouTube](https://www.youtube.com/) video and the URL for the video is `https://www.youtube.com/watch?v=9bZkp7q19f0` or `https://youtu.be/9bZkp7q19f0`, you would write something like this:

```
field: ready_to_proceed
question: |
  Welcome to the interview.
subquestion: |
  Please watch this introductory video
  before proceeding with the interview.
video: |
  [YOUTUBE 9bZkp7q19f0]
```

[![Image 74: Screenshot of video example](https://docassemble.org/img/examples/video.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/video.yml&reset=1 "Click to try this interview")

`[YOUTUBE ...]` assumes that the aspect ratio of the vide is 16:9. If the aspect ratio of the video is 4:3, you can use `[YOUTUBE4:3 ...]`. You can also explicitly state that the aspect ratio is 16:9 by using `[YOUTUBE16:9 ...]`.

Providing `help` text to users[¶](https://docassemble.org/docs/modifiers.html#help)
-----------------------------------------------------------------------------------

```
question: |
  How much money do you wish
  to seek in damages?
fields:
  - Money: damages_sought
    datatype: currency
help: |
  If you are not sure how much
  money to seek in damages, just ask
  for a million dollars, since you
  want ${ defendant } to suffer.
```

[![Image 75: Screenshot of help-damages example](https://docassemble.org/img/examples/help-damages.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/help-damages.yml&reset=1 "Click to try this interview")

In the web app, users can use the navigation bar to toggle between the “Question” tab and the “Help” tab. The contents of the “Help” tab consist of the contents of any `help` specifiers in the question being presented, followed by the contents of any `interview help` blocks contained within the interview.

You can add audio to your help text:

```
question: |
  How much money do you wish
  to seek in damages?
fields:
  - Money: damages_sought
    datatype: currency
help:
  content: |
    If you are not sure how much
    money to seek in damages, just ask
    for a million dollars, since you
    want ${ defendant } to suffer.
  audio: |
    message_re_damages.mp3
```

[![Image 76: Screenshot of help-damages-audio example](https://docassemble.org/img/examples/help-damages-audio.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/help-damages-audio.yml&reset=1 "Click to try this interview")

You can also add video to help text using the `video` specifier.

When [`interview help`](https://docassemble.org/docs/initial.html#interview%20help) is available but question-specific `help` is not available, the help tab is merely labeled “Help.” When question-specific help is available, the help tab is bright yellow and is marked with a star. If you want the label to be something other than “Help”, you can add a `label` inside the `help` specifier:

```
question: |
  How much money do you wish
  to seek in damages?
fields:
  - Money: damages_sought
    datatype: currency
help:
  label: |
    More info
  content: |
    If you are not sure how much
    money to seek in damages, just ask
    for a million dollars, since you
    want ${ defendant } to suffer.
```

[![Image 77: Screenshot of help-damages-label example](https://docassemble.org/img/examples/help-damages-label.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/help-damages-label.yml&reset=1 "Click to try this interview")

If the [`question help button`](https://docassemble.org/docs/initial.html#question%20help%20button) feature is enabled, and question-specific `help` is available, a “Help” button will be available on the button bar, which when pressed will show the help tab. The button label is “Help” by default, but if a `label` is provided to the question-specific `help`, the button will bear this label instead. When a help button is present, the help tab in the navigation bar will always be labeled “Help,” and it will never be highlighted in yellow.

The default label “Help” can be changed on a per-interview basis. If you set an [`interview help`](https://docassemble.org/docs/initial.html#interview%20help) initial block and provide a `label` as part of it, the value of this `label` will be used instead of “Help” as the name of the “Help” tab in the navigation bar. You can also use [screen parts](https://docassemble.org/docs/questions.html#screen%20parts) methods to set this value (which is called `help label`).

Adding images to question: `decoration`[¶](https://docassemble.org/docs/modifiers.html#decoration)
--------------------------------------------------------------------------------------------------

```
decoration: kids
question:
  Do you have children?
yesno: has_children
```

[![Image 78: Screenshot of decoration example](https://docassemble.org/img/examples/decoration.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/decoration.yml&reset=1 "Click to try this interview")

The `decoration` modifier adds an icon to the right of the [`question`](https://docassemble.org/docs/questions.html#question) text. In the example above, `kids` has been defined in an [`image sets`](https://docassemble.org/docs/initial.html#image%20sets) or [`images`](https://docassemble.org/docs/initial.html#images) block.

By default, if a `decoration` modifier refers to an image that has not been defined in an [`image sets`](https://docassemble.org/docs/initial.html#image%20sets) or [`images`](https://docassemble.org/docs/initial.html#images) block, users will see an error message. However, if you set the [`use font awesome`](https://docassemble.org/docs/config.html#use%20font%20awesome) directive in the [Configuration](https://docassemble.org/docs/config.html) to `True`, then any reference to an image not defined with [`image sets`](https://docassemble.org/docs/initial.html#image%20sets) or [`images`](https://docassemble.org/docs/initial.html#images) will be treated as the name of a [Font Awesome](https://fontawesome.com/) icon.

```
mandatory: True
decoration: chart-bar
question: |
  Third quarter metrics
subquestion: |
  We are making more money
  :far-fa-money-bill-alt: than
  we did in the second quarter.

  So you can sleep well tonight! :bed:
```

[![Image 79: Screenshot of font-awesome example](https://docassemble.org/img/examples/font-awesome.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/font-awesome.yml&reset=1 "Click to try this interview")

This method also works with [inline icons](https://docassemble.org/docs/markup.html#emoji).

Adding [JavaScript](https://en.wikipedia.org/wiki/JavaScript): `script`[¶](https://docassemble.org/docs/modifiers.html#script)
------------------------------------------------------------------------------------------------------------------------------

If you know how to write [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets), you can add [JavaScript](https://en.wikipedia.org/wiki/JavaScript) code and [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) formatting to a question.

```
question: |
  Do you want to build a snowman?
subquestion: |
  <span id="beg"></span>
yesno: wants_to_build_snowman
script: |
  <script>
    setTimeout(function(){
      $("#beg").html("Pretty please?");
    }, 3000);
  </script>
```

[![Image 80: Screenshot of script example](https://docassemble.org/img/examples/script.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/script.yml&reset=1 "Click to try this interview")

This [JavaScript](https://en.wikipedia.org/wiki/JavaScript) will be executed when the screen loads.

To add [JavaScript](https://en.wikipedia.org/wiki/JavaScript) or [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) to all questions, you can use a [`features`](https://docassemble.org/docs/initial.html#features) block to include [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) files on the web page.

Note that the **docassemble** front end is a “single page application,” which means that when the user presses the Continue button or the Back button, the page does not reload; rather, an Ajax request is sent to the server and then the DOM is redrawn. The code in the `script` modifier is run whenever the `question` is shown. That means that the `script` code may run more than once in the user’s browser session.

Therefore, you should not use code in a `script` modifier to attach a `daPageLoad` listener, because that could mean that the listener will be attached more than once. Therefore, only attach `daPageLoad` listeners from a [JavaScript](https://en.wikipedia.org/wiki/JavaScript) file that you include using the [`javascript`](https://docassemble.org/docs/initial.html#javascript) feature.

Adding [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets): `css`[¶](https://docassemble.org/docs/modifiers.html#css)
-----------------------------------------------------------------------------------------------------------------------------

The `css` modifier contains raw HTML that will be appended to the HTML `<head>`.

```
question: |
  Do you want to build a snowman?
yesno: wants_to_build_snowman
css: |
  <style>
    body {
      background-image: url('${ url_of('docassemble.base:data/static/snowman.png') }');
      background-repeat: repeat;
    }
  </style>
```

[![Image 81: Screenshot of css example](https://docassemble.org/img/examples/css.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/css.yml&reset=1 "Click to try this interview")

It is best only to include [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) that is tied to specified HTML elements you include in your questions, rather than include [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) that has global effects (like the example above). Because of the way **docassemble** interviews work, [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) applied in one question will affect later questions until the screen is reloaded.

In the vast majority of situations, you should not use the `css` modifier, but should instead write a CSS file that you include using [`css`](https://docassemble.org/docs/initial.html#css) in a [`features`](https://docassemble.org/docs/initial.html#features) block.

The progress bar[¶](https://docassemble.org/docs/modifiers.html#progress)
-------------------------------------------------------------------------

A **docassemble** interview can be configured to show a [progress bar](https://docassemble.org/docs/initial.html#features). This will show the user a progress indicator to give the user a sense of how much longer the interview will take.

The progress along the bar at any question needs to be set with the `progress` modifier. For example:

```
features:
  progress bar: True
---
question: Are you doing well?
yesno: user_is_well
progress: 20
---
question: Done with the interview.
subquestion: |
  % if user_is_well:
  I am glad you are doing well.
  % else:
  I am sorry to hear that!
  % endif
progress: 100
mandatory: True
```

[![Image 82: Screenshot of progress example](https://docassemble.org/img/examples/progress.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/progress.yml&reset=1 "Click to try this interview")

The value of `progress` needs to be a number between 0 and 100. If the value is zero, the progress bar is hidden for the current question. If the value is greater than 100, a full progress bar will be shown. If the value is `None` (`null` in [YAML](https://en.wikipedia.org/wiki/YAML)), then the progress bar will be hidden and will not advance until it is set to something else.

You can also control the progress meter with the [`get_progress()`](https://docassemble.org/docs/functions.html#get_progress) and [`set_progress()`](https://docassemble.org/docs/functions.html#set_progress) functions.

If the [progress bar](https://docassemble.org/docs/initial.html#features) is enabled and the interview encounters a question that does not have a `progress` setting, the progress bar will advance automatically. The amount by which the progress bar automatically advances gets smaller as the progress bar gets closer to 100%.

As a result, you do not need to attach a `progress` setting to every question; you can just set `progress` on a few questions, and let the automatic advancing mechanism take care of increasing the progress.

If the interview reaches a question with a `progress` setting that is less than the current position of the [progress bar](https://docassemble.org/docs/initial.html#features), the position of the [progress bar](https://docassemble.org/docs/initial.html#features) will stay the same. This ensures that the user does not see the [progress bar](https://docassemble.org/docs/initial.html#features) go backward.

If you want the [progress bar](https://docassemble.org/docs/initial.html#features) to go back or reset, you can use the [`set_progress()`](https://docassemble.org/docs/functions.html#set_progress) function to force the [progress bar](https://docassemble.org/docs/initial.html#features) setting to a particular value. For example:

```
mandatory: True
code: |
  first_part_done
  second_part_done
  final_screen
---
code: |
  user_is_well
  user_is_bigger_than_a_breadbox
  ready_for_second_part
  set_progress(0)
  first_part_done = True
---
code: |
  user_likes_turnips
  user_likes_clownfish
  second_part_done = True
```

[![Image 83: Screenshot of progress-multi example](https://docassemble.org/img/examples/progress-multi.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/progress-multi.yml&reset=1 "Click to try this interview")

The section navigation bar[¶](https://docassemble.org/docs/modifiers.html#section)
----------------------------------------------------------------------------------

A **docassemble** interview can be configured to show a left-hand [navigation bar](https://docassemble.org/docs/initial.html#navigation%20bar) on screens large enough to show one. The navigation bar will contain a list of the sections in the interview, as specified in the [`sections`](https://docassemble.org/docs/initial.html#sections) initial block or using the [`nav.set_sections()`](https://docassemble.org/docs/functions.html#DANav.set_sections) function. In the navigation bar, the current section will be highlighted.

Adding the `section` modifier to a question will update the current section when the interview asks the question. This section will continue to be the current section until another question is reached that contains a `section` modifier that specifies a different section.

As explained in the documentation for the [`sections`](https://docassemble.org/docs/initial.html#sections) initial block, you have the option of referring to a section by a keyword that is different from the name of the section that is displayed to the user. If you are using this feature, your `section` modifier needs to refer to the keyword, not the displayed name.

```
sections:
  - Introduction
  - About you:
    - Contact info
    - Demographics
  - Preferences
  - Conclusion
---
features:
  navigation: True
  progress bar: True
---
mandatory: True
code: |
  menu_items = [ action_menu_item('Roadmap', 'road_map') ]
---
initial: True
code: |
  if returning_user(minutes=0.5):
    welcome_back
---
mandatory: True
question: |
  Welcome to the interview
subquestion: |
  If you are not on a
  smartphone-sized device,
  you should see a navigation
  bar to the left.
field: sees_nav_bar
---
mandatory: True
question: |
  I am going to ask you some
  questions about yourself.
field: intro_to_about_you
section: About you
---
mandatory: True
question: |
  What is your name?
fields:
  - First Name: first_name
  - Last Name: last_name
section: Contact info
---
mandatory: True
question: |
  What is your e-mail address?
fields:
  - E-mail: email_address
    datatype: email
---
mandatory: True
question: |
  What is your gender?
field: gender
choices:
  - Male
  - Female
  - Something else
section: Demographics
---
mandatory: True
question: |
  What kind of belly button
  do you have?
subquestion: |
  To see what a user would
  see after returning to
  the interview after a period
  of absence, try waiting
  thirty seconds, then
  [click into the
  interview](${ interview_url(local=True) }).

  In addition, there is a similar
  screen available on the Menu in the
  upper-right, under "Roadmap."
field: belly_button
choices:
  - Innie
  - Outie
---
mandatory: True
question: |
  What is your favorite fruit?
fields:
  - Favorite fruit: favorite_fruit
section: Preferences
---
mandatory: True
question: |
  What is your favorite vegetable?
fields:
  - Favorite vegetable: favorite_vegetable
---
progress: 100
mandatory: True
question: Thank you.
subquestion: |
  ${ first_name },

  Your answers mean a lot to me.
  
  I am going to go eat some
  ${ favorite_vegetable }
  now.
section: Conclusion
---
event: welcome_back
question: |
  Welcome back!
subquestion: |
  You are currently in the
  **${ nav.get_section(display=True) }**
  section.

  ${ nav }

  Press "Continue" to pick up
  where you left off.
buttons:
  Continue: continue
---
event: road_map
question: |
  Roadmap
subquestion: |
  You are currently in the
  **${ nav.get_section(display=True) }**
  section.

  ${ nav }

  Press "Continue" to resume the
  interview.
buttons:
  Continue: continue
```

[![Image 84: Screenshot of sections example](https://docassemble.org/img/examples/sections.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/sections.yml&reset=1 "Click to try this interview")

The `section` can include [Mako](https://www.makotemplates.org/) templating.

You can also set the current section using the [`nav.set_section()`](https://docassemble.org/docs/functions.html#DANav.set_section) function.

Disable the back button: `prevent going back`[¶](https://docassemble.org/docs/modifiers.html#preventgoingback)
--------------------------------------------------------------------------------------------------------------

Normally, **docassemble** allows the user to click the back button to get back to earlier steps in the interview. Sometimes, it is necessary to prevent the user from doing so.

If you add a `prevent going back` specifier to a [`question`](https://docassemble.org/docs/questions.html#question), the web app will not offer the user a back button while showing the question.

```
prevent going back: True
question: |
  Your application for ${ service }
  has been submitted.
mandatory: True
```

[![Image 85: Screenshot of prevent-going-back example](https://docassemble.org/img/examples/prevent-going-back.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/prevent-going-back.yml&reset=1 "Click to try this interview")

There is also a [`prevent_going_back()` function](https://docassemble.org/docs/functions.html#prevent_going_back) that accomplishes the same thing from [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code. This may be more useful than the `prevent going back` modifier if the need to prevent the user from clicking the back button depends on the outcome of a process.

Adding a back button inside the question[¶](https://docassemble.org/docs/modifiers.html#backbutton)
---------------------------------------------------------------------------------------------------

You can add a “Back” button to the buttons at the bottom of the screen by setting the `back button` modifier.

```
question: Is the sky blue?
yesno: sky_is_blue
back button: |
  not user_is_well
```

[![Image 86: Screenshot of question-back-button-sometimes example](https://docassemble.org/img/examples/question-back-button-sometimes.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/question-back-button-sometimes.yml&reset=1 "Click to try this interview")

If `back button` is set to `True` or to [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code that evaluates to a true value, then the button will be shown.

You can configure this on an interview-wide basis by setting the [`question back button`](https://docassemble.org/docs/initial.html#question%20back%20button) feature.

Changing the text of the back button[¶](https://docassemble.org/docs/modifiers.html#backbuttonlabel)
----------------------------------------------------------------------------------------------------

When you add a “Back” button to the buttons at the bottom of the screen by setting the [`back button`](https://docassemble.org/docs/modifiers.html#backbutton) modifier or the [``` question back button ```](https://docassemble.org/docs/initial.html#question%20back%20button) feature, you can change the text of the button using the `back button label` modifier.

```
question: Is the sky blue?
yesno: sky_is_blue
back button: True
back button label: |
  Wait, go back
```

[![Image 87: Screenshot of question-back-button-sometimes-label example](https://docassemble.org/img/examples/question-back-button-sometimes-label.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/question-back-button-sometimes-label.yml&reset=1 "Click to try this interview")

The text of the label can include [Mako](https://www.makotemplates.org/) templating.

You can change the back button in the upper-left corner by using the `corner back button label` modifier.

For information about other ways to set a default value for back button labels, see the [screen parts](https://docassemble.org/docs/questions.html#screen%20parts) section.

Vocabulary `terms` and `auto terms`[¶](https://docassemble.org/docs/modifiers.html#terms)
-----------------------------------------------------------------------------------------

Using the modifiers `terms` or `auto terms`, you can specify the definitions of particular vocabulary terms, and **docassemble** will turn them into green hyperlinks. When the user clicks on the hyperlink, a popup appears with the word’s definition.

You can define the vocabulary terms using `terms` and then put curly brackets around the instances of the words that you want to become hyperlinks.

```
question: Have you ever met a {creeper}?
subquestion: |
  If you have met a {zombie pigman}, you
  have almost certainly met a creeper.
yesno: met_a_creeper
terms:
  creeper: |
    A tall ${ creeper_color } creature
    that explodes if you get too close.
  zombie pigman: |
    A harmless creature who carries a gold
    sword.
```

[![Image 88: Screenshot of question-terms example](https://docassemble.org/img/examples/question-terms.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/question-terms.yml&reset=1 "Click to try this interview")

Alternatively, you can define the vocabulary terms using `auto terms`, in which case you do not need to use curly brackets, and the terms will be highlighted in green every time they appear in the question.

```
question: Have you ever met a creeper?
subquestion: |
  If you have met a zombie pigman, you
  have almost certainly met a creeper.
yesno: met_a_creeper
auto terms:
  creeper: |
    A tall ${ creeper_color } creature
    that explodes if you get too close.
  zombie pigman: |
    A harmless creature who carries a gold
    sword.
```

[![Image 89: Screenshot of question-autoterms example](https://docassemble.org/img/examples/question-autoterms.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/question-autoterms.yml&reset=1 "Click to try this interview")

Using `auto terms` can lead to ambiguities, so it is generally better to use `terms` if you can. If you have two terms, `green apple` and `apple`, then `auto terms` will try to make a term within a term, which will lead to unpredictable behavior. `auto terms` can also cause problems if the term is contained inside of HTML. So while `auto terms` is convenient when it works, it might not always work, so using `terms` is preferable.

If you want to refer to a term but you want the text of the hyperlink to be different from the name of the term, you can use the pipe character `|` and write the alternate text after the `|`.

```
question: Have you ever met a {creeper}?
subquestion: |
  If you have met a
  {zombie pigman|zombified pigman},
  you have almost certainly met a creeper.
yesno: met_a_creeper
terms:
  creeper: |
    A tall ${ creeper_color } creature
    that explodes if you get too close.
  zombie pigman: |
    A harmless creature who carries a gold
    sword.
```

[![Image 90: Screenshot of question-terms-alternate example](https://docassemble.org/img/examples/question-terms-alternate.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/question-terms-alternate.yml&reset=1 "Click to try this interview")

Alternatively, in your definition of the terms, you can specify that multiple phrases should be associated with a single definition. You write your terms as a list of dictionaries, and if a dictionary has two keys, `phrases` and `definition`, where `phrases` refers to a list of terms and `definition` refers to a definition, that definition will be used for each of the phrases:

```
terms:
  - phrases:
      - charged creeper
      - creeper
    definition: |
      A tall green creature that explodes if
      you get too close.
  - zombie pigman: |
      A harmless creature who carries a gold
      sword.
```

If you want vocabulary terms to be highlighted throughout the interview, not just for a specific question, you can use `terms` and `auto terms` as [initial blocks](https://docassemble.org/docs/initial.html). You can also define interview-wide terms using [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code by calling the [`update_terms()`](https://docassemble.org/docs/functions.html#update_terms) function.

The `language` of the question[¶](https://docassemble.org/docs/modifiers.html#language)
---------------------------------------------------------------------------------------

```
---
question: |
  What is the meaning of life?
fields:
  - Meaning of life: meaning_life
---
language: es
question: |
  ¿Cuál es el significado de la vida?
fields:
  - Significado de la Vida: meaning_life
---
```

**docassemble**’s [language support](https://docassemble.org/docs/language.html) allows a single interview to ask questions different ways depending on the user’s language. You can write questions in different languages that set the same variables. **docassemble** will use whatever question matches the active language.

The value of `language` must be a two-character lowercase [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) or [ISO-639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes) code. For example, Spanish is `es`, French is `fr`, and Arabic is `ar`.

For more information about how to set the active language, see [language support](https://docassemble.org/docs/language.html).

Instead of explicitly setting a `language` for every question, you can use [default language](https://docassemble.org/docs/initial.html#default%20language) to apply a particular language to the remaining questions in the file (see [initial blocks](https://docassemble.org/docs/initial.html)).

Changing the `continue button label`[¶](https://docassemble.org/docs/modifiers.html#continuebuttonlabel)
--------------------------------------------------------------------------------------------------------

Some types of questions feature a “Continue” button. If you want the label on the button to be something other than the word “Continue,” add a `continue button label` modifier.

```
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
continue button label: Keep going
```

[![Image 91: Screenshot of continue-button-label example](https://docassemble.org/img/examples/continue-button-label.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/continue-button-label.yml&reset=1 "Click to try this interview")

The types of questions that feature a “Continue” button include:

*   [`field` with `choices`](https://docassemble.org/docs/fields.html#field%20with%20choices)
*   [`fields`](https://docassemble.org/docs/fields.html#fields)
*   [`continue button field`](https://docassemble.org/docs/fields.html#continue%20button%20field)

This modifier also allows you to customize the “Done” button that appears in [`signature`](https://docassemble.org/docs/fields.html#signature) questions.

For information about other ways to set a default value for the “Continue” button label, see the [screen parts](https://docassemble.org/docs/questions.html#screen%20parts) section.

Changing the `continue button color`[¶](https://docassemble.org/docs/modifiers.html#continuebuttoncolor)
--------------------------------------------------------------------------------------------------------

In addition to modifying the label of the “Continue” button, you can set its color to one of the [Bootstrap colors](https://getbootstrap.com/docs/5.2/customize/color/).

```
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
continue button label: Keep going
continue button color: success
```

[![Image 92: Screenshot of continue-button-color example](https://docassemble.org/img/examples/continue-button-color.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/continue-button-color.yml&reset=1 "Click to try this interview")

Reusable questions: `generic object`[¶](https://docassemble.org/docs/modifiers.html#genericobject)
--------------------------------------------------------------------------------------------------

```
generic object: Individual
question: |
  Does ${ x } like cats?
yesno: x.likes_cats
```

[![Image 93: Screenshot of generic-object example](https://docassemble.org/img/examples/generic-object.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/generic-object.yml&reset=1 "Click to try this interview")

`generic object` is a very powerful feature in **docassemble** that allows interview developers to express questions in general terms.

The above example will cause **docassemble** to ask “Does Sally Smith like cats?” if the interview logic calls for `neighbor.likes_cats` and `neighbor` is an object of type [`Individual`](https://docassemble.org/docs/objects.html#Individual) whose name has been set to “Sally Smith.” The same question will also ask “Does William Jones like cats?” if the interview logic calls for `teacher.likes_cats`, and `teacher` is an object of type [`Individual`](https://docassemble.org/docs/objects.html#Individual) whose name has been set to “William Jones.”

`x` is a special variable that should only be used in `generic object` questions. The above question definition tells **docassemble** that if it ever needs the `likes_cats` attribute for any object of type [`Individual`](https://docassemble.org/docs/objects.html#Individual), it can get an answer by asking this question.

If your interview needs a definition for `spouse.likes_cats`, where `spouse` is an object of type `Individual`, **docassemble** will first look for a question that offers to define `spouse.likes_cats`. If no such question exists, it will then look for a question that offers to defined `x.likes_cats`, where the `generic object` is [`Individual`](https://docassemble.org/docs/objects.html#Individual). If no such question exists, it will look for `generic object` questions for the parent types of [`Individual`](https://docassemble.org/docs/objects.html#Individual). The variables that will be sought, in the order in which they will be sought, are:

*   `spouse.likes_cats`
*   `x.likes_cats` where `generic object` is [`Individual`](https://docassemble.org/docs/objects.html#Individual).
*   `x.likes_cats` where `generic object` is [`Person`](https://docassemble.org/docs/objects.html#Person).
*   `x.likes_cats` where `generic object` is [`DAObject`](https://docassemble.org/docs/objects.html#DAObject).

This way, you can provide layers of `generic object` blocks to handle special cases as well as general cases, based on the object type. For example, suppose your interview uses objects of type [`Individual`](https://docassemble.org/docs/objects.html#Individual), [`Organization`](https://docassemble.org/docs/objects.html#Organization), and [`Person`](https://docassemble.org/docs/objects.html#Person). An [`Individual`](https://docassemble.org/docs/objects.html#Individual) is a special type of [`Person`](https://docassemble.org/docs/objects.html#Person), and an [`Organization`](https://docassemble.org/docs/objects.html#Organization) is also a special type of [`Person`](https://docassemble.org/docs/objects.html#Person). Suppose you have a general way of asking for a mailing address (“What is so-and-so’s address?”), but you want to have a special way of asking the question if you need the mailing address of an [`Organization`](https://docassemble.org/docs/objects.html#Organization) (e.g., “What is ABC Incorporated’s primary place of business?”). You would write a question with ```
generic object:
Person
``` for the general case, and a question with ```
generic object:
Organization
``` for the special case. The general question would be used for objects of type [`Individual`](https://docassemble.org/docs/objects.html#Individual) and [`Person`](https://docassemble.org/docs/objects.html#Person), and the special question would be used for objects of type [`Organization`](https://docassemble.org/docs/objects.html#Organization).

You can also use `generic object` [`code`](https://docassemble.org/docs/code.html#code) blocks in a [fallback](https://docassemble.org/docs/logic.html#fallback) arrangement to capture special cases within object types. Suppose you have a function `retrieve_ein()` that can automatically determine an organization’s Employer Identification Number (EIN), but only for organizations organized as non-profits. For organizations not organized as non-profits, you will need to ask the user for the EIN. You could use the following two blocks to accomplish this:

```
generic object: Organization
question: |
  What is the EIN of ${ x }?
fields:
  - EIN: x.ein
---
generic object: Organization
code: |
  if x.tax_status == '501c3':
    x.ein = retrieve_ein(x.name)
```

[![Image 94: Screenshot of generic-object-ein example](https://docassemble.org/img/examples/generic-object-ein.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/generic-object-ein.yml&reset=1 "Click to try this interview")

Whenever the `.ein` of an organization is needed, the [`code`](https://docassemble.org/docs/code.html#code) block will be run, but the attribute will not be set if the organization is not a non-profit. In that case, **docassemble** will notice that the attribute is still not defined, and it will “fall back” to the [`question`](https://docassemble.org/docs/questions.html#question) that asks the user to manually enter the EIN.

As explained in the [fallback](https://docassemble.org/docs/logic.html#fallback) section of the documentation, the order in which these two blocks appear in the [YAML](https://en.wikipedia.org/wiki/YAML) file matters; the [`code`](https://docassemble.org/docs/code.html#code) block will be tried first only if it appears later in the [YAML](https://en.wikipedia.org/wiki/YAML) file than the [`question`](https://docassemble.org/docs/questions.html#question) block.

The `generic object` modifier can be used on any block that sets a variable, including [`question`](https://docassemble.org/docs/questions.html#question), [`code`](https://docassemble.org/docs/code.html#code), [`template`](https://docassemble.org/docs/initial.html#template), [`table`](https://docassemble.org/docs/initial.html#table), [`attachment`](https://docassemble.org/docs/documents.html#attachment), and [`objects`](https://docassemble.org/docs/initial.html#objects), [`objects from file`](https://docassemble.org/docs/initial.html#objects%20from%20file), [`data`](https://docassemble.org/docs/initial.html#data), [`data from code`](https://docassemble.org/docs/initial.html#data%20from%20code).

A similar feature to `generic object` and its special variable `x` is the special [index variable `i`](https://docassemble.org/docs/fields.html#index%20variables). For more information about this feature, see the [index variable documentation](https://docassemble.org/docs/fields.html#index%20variables) and the documentation in the [groups section](https://docassemble.org/docs/groups.html).

The `role` of the question[¶](https://docassemble.org/docs/modifiers.html#role)
-------------------------------------------------------------------------------

```
---
role: advocate
question: Is the client's explanation a sound one?
subquestion: |
  ${ client } proposed the following explanation:
  
  > ${ explanation }

  Is this a legally sufficient explanation?
yesno: explanation_is_sound
---
```

If your interview uses the [roles](https://docassemble.org/docs/roles.html) feature for multi-user interviews, the `role` modifier in a [`question`](https://docassemble.org/docs/questions.html#question) block will tell **docassemble** that if it ever tries to ask this question, the user will need to have a particular role in order to proceed.

`role` can be a list.

```
role:
  - advocate
  - supervisor
```

In this case, the user’s role can either “advocate” or “supervisor” in order to be asked the question.

If the user does not have an appropriate role, **docassemble** will look for a question in the interview in which `event` has been set to `role_event`.

Automatically `reload` the screen[¶](https://docassemble.org/docs/modifiers.html#reload)
----------------------------------------------------------------------------------------

To cause the screen to reload in the web browser after a number of seconds, use the `reload` modifier.

```
reload: True
question: |
  You have viewed this screen
  ${ counter }
  ${ noun_plural('time', counter) }.
field: acknowledged
```

[![Image 95: Screenshot of reload example](https://docassemble.org/img/examples/reload.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/reload.yml&reset=1 "Click to try this interview")

If you set `reload` to `True`, the screen on which the question is asked will reload every 10 seconds. To use a different number of seconds, set `reload` to the number of seconds you wish to use. E.g.,

```
reload: 5
```

Since it is not good to reload the screen too quickly, you cannot use a number of seconds less than four. If the number of seconds is less than four, four seconds will be used as the number of seconds.

You can use [Mako](https://www.makotemplates.org/) to determine the number of seconds. If the `reload` value evaluates to `False` or `None`, the screen will not reload.

Tag a block with a unique id[¶](https://docassemble.org/docs/modifiers.html#id)
-------------------------------------------------------------------------------

In some situations, you may need to tag a block in your interview with a unique ID. You can use the `id` specifier to do so.

```
---
id: initialize
mandatory: True
code: |
  initial_value = 48
---
```

In the absence of an `id` specifier, **docassemble** would refer to a block like this with a name like `Question_3` (if this block was the third block in the interview). But with `id` set to `initialize`, **docassemble** will internally refer to this block with the ID `initialize`.

In most cases, your blocks do not need to have unique IDs. However, there are some features in **docassemble**, such as the [Google Analytics integration](https://docassemble.org/docs/config.html#google%20analytics) feature, the [CSS custom class](https://docassemble.org/docs/initial.html#css%20customization) feature, and the [changing order of precedence](https://docassemble.org/docs/modifiers.html#precedence) feature discussed [below](https://docassemble.org/docs/modifiers.html#precedence), all of which use `id` specifiers.

Also, in some situations, it can be important to tag your interview blocks with a unique name that does not change when the blocks in the interview [YAML](https://en.wikipedia.org/wiki/YAML) file change. This is because when **docassemble** stores interview answers, it not only stores the current state of the interview variables, but it also stores information about which `mandatory` blocks have run to completion. When it does so, it tracks the block using the ID for the block. If the IDs are arbitrary names like `Question_3`, users could encounter problems

For example, think about what would happen if a user started working an interview on April 3, and got half-way through, and then saved her answers and logged out, intending to log back in on April 10. Then suppose that on April 8, you install a new version of the interview, adding new functionality. When the user logs back in on April 10, her interview answers might not be compatible with your new version of the interview. For example, suppose that on April 3, the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html#code) block known as `Question_12` ran to completion. But when the user logs in on April 10 and resumes the interview, the code block formerly known as `Question_12` is now known as `Question_14`. When **docassemble** evaluates her interview session, it will determine that the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html#code) block known as `Question_14` has not run yet, so it will run that code block. This might cause information in the user’s session to be overwritten. You can avoid problems like these by tagging your code blocks with `id` tags, so that the names of the blocks do not change between versions of your interview.

Another way to avoid problems with the impact of software upgrades on existing sessions is to use a different interview [YAML](https://en.wikipedia.org/wiki/YAML) file for each version of an interview. So a user that starts `docassemble.tax:data/questions/tax-controversy-v2.yml` will always use the same [YAML](https://en.wikipedia.org/wiki/YAML) file, even when users who started later are using `docassemble.tax:data/questions/tax-controversy-v3.yml`.

The `id` of a question needs to be set in order to use the [`forget_result_of()`](https://docassemble.org/docs/functions.html#forget_result_of) function.

Google Analytics IDs[¶](https://docassemble.org/docs/modifiers.html#gaid)
-------------------------------------------------------------------------

If you are using the [Google Analytics integration](https://docassemble.org/docs/config.html#google%20analytics) feature, by default, the [`id`](https://docassemble.org/docs/modifiers.html#id) will be used as part of the pseudo-path sent to Google Analytics. If you would rather use a different ID, you can explicitly set a `ga id`:

```
id: lead certification
ga id: landlordLeadCert
question: |
  Does your landlord have a valid lead certification?
yesno: lead_certification_exists
```

Segment IDs[¶](https://docassemble.org/docs/modifiers.html#segmentid)
---------------------------------------------------------------------

If you are using the [Segment integration](https://docassemble.org/docs/config.html#segment%20id) feature, by default, the [`id`](https://docassemble.org/docs/modifiers.html#id) will be used as part of the pseudo-path sent to Google Analytics. If you would rather use a different ID, you can explicitly set a `segment id`:

```
id: lead certification
segment id: landlordLeadCert
question: |
  Does your landlord have a valid lead certification?
yesno: lead_certification_exists
```

You can also send [Segment](https://segment.com/) messages with arguments, using the `segment` specifier pointing to a dictionary with keys for `id` and `arguments`:

```
id: lead certification
segment:
  id: landlord
  arguments:
    certification: lead
question: |
  Does your landlord have a valid lead certification?
yesno: lead_certification_exists
```

Breadcrumb name[¶](https://docassemble.org/docs/modifiers.html#breadcrumb)
--------------------------------------------------------------------------

If you are using a [`DABreadCrumbs`](https://docassemble.org/docs/objects.html#DABreadCrumbs) object to display breadcrumbs to the user, you can use the `breadcrumb` modifier on any [`question`](https://docassemble.org/docs/questions.html#question) to indicate the title of the [`question`](https://docassemble.org/docs/questions.html#question) as it should appear in the breadcrumbs display. [Mako](https://www.makotemplates.org/) can be used in a `breadcrumb` modifier. If no `breadcrumb` modifier is present, the text of the `question` specifier is used instead. For more information about using breadcrumbs, see the documentation for [`DABreadCrumbs`](https://docassemble.org/docs/objects.html#DABreadCrumbs).

Manually indicating that a block sets a variable[¶](https://docassemble.org/docs/modifiers.html#sets)
-----------------------------------------------------------------------------------------------------

Usually, **docassemble** can figure out which variables a block is capable of defining. If a code block consists of:

```
---
code: |
  if hell.temperature_in_celcius == 0:
    claim_is_valid = True
---
```

then **docassemble** will try to run it if it needs a definition for `claim_is_valid`. Sometimes, however, **docassemble** needs a hint.

You can explicitly indicate that a block sets a variable using `sets`:

```
---
sets: claim_is_valid
code: |
  if hell.temperature_in_celcius == 0:
    claim_is_valid = True
---
```

It also accepts multiple values:

```
---
sets: 
  - claim_is_valid
  - type_of_claim
code: |
  if hell.temperature_in_celcius == 0:
    claim_is_valid = True
    type_of_claim = 'tort'
---
```

Indicating that a block only sets certain variables[¶](https://docassemble.org/docs/modifiers.html#onlysets)
------------------------------------------------------------------------------------------------------------

The `only sets` modifier acts like `sets`, but also indicates ```
scan
for variables: False
```.

The following two blocks are equivalent.

```
scan for variables: False
sets: property_assessed
code: |
  if total_property > 50000
    property_deduction_available = False
  property_assessed = True
```

```
only sets: property_assessed
code: |
  if total_property > 50000
    property_deduction_available = False
  property_assessed = True
```

Indicating that a block is permitted to set a variable[¶](https://docassemble.org/docs/modifiers.html#allowedtoset)
-------------------------------------------------------------------------------------------------------------------

If you have enabled [`restrict input variables`](https://docassemble.org/docs/config.html#restrict%20input%20variables) in your [Configuration](https://docassemble.org/docs/config.html), then you will not be able to use custom [JavaScript](https://en.wikipedia.org/wiki/JavaScript) to cause [`question`](https://docassemble.org/docs/questions.html#question) blocks to set variables other than the variables specified in the [YAML](https://en.wikipedia.org/wiki/YAML) of the [`question`](https://docassemble.org/docs/questions.html#question) blocks. The ```
allowed to
set
``` modifier allows you to get around this limitation by listing specific variable names that the [`question`](https://docassemble.org/docs/questions.html#question) block should be allowed to set. You can set `allowed to set` to a [YAML](https://en.wikipedia.org/wiki/YAML) list of variable names or to a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) that evaluates to a list of variable names.

Changing order of precedence[¶](https://docassemble.org/docs/modifiers.html#precedence)
---------------------------------------------------------------------------------------

As explained in [how **docassemble** finds questions for variables](https://docassemble.org/docs/logic.html#variablesearching), if there is more than one [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html#code) block that offers to define a particular variable, blocks that are later in the [YAML](https://en.wikipedia.org/wiki/YAML) file will be tried first.

For example, suppose your friend developed a [YAML](https://en.wikipedia.org/wiki/YAML) file with questions and code blocks that define the variables `client.age`, `client.eligible`, and `docket_number`. In your interview, you would like to define `client.age` and `client.eligible` the same way your friend does. You can accomplish this by using [`include`](https://docassemble.org/docs/initial.html#include) to incorporate by reference your friend’s [YAML](https://en.wikipedia.org/wiki/YAML) file. But suppose you don’t like the way your friend asks the question to determine `docket_number`. No problem; just write a [`question`](https://docassemble.org/docs/questions.html#question) in your own [YAML](https://en.wikipedia.org/wiki/YAML) file that defines `docket_number`, and make sure that this [`question`](https://docassemble.org/docs/questions.html#question) appears after the [`include`](https://docassemble.org/docs/initial.html#include) block that incorporates your friend’s [YAML](https://en.wikipedia.org/wiki/YAML) file. That way, your question will be used instead of your friend’s.

However, there may be times when the relative placement of blocks within the [YAML](https://en.wikipedia.org/wiki/YAML) file is not a convenient way for you to designate which questions override other questions.

For example, suppose there are two [`question`](https://docassemble.org/docs/questions.html#question) blocks in your interview that define `favorite_fruit`. The second one is always used because it appears later in the [YAML](https://en.wikipedia.org/wiki/YAML); the second question supersedes the first.

```
question: |
  What the heck is your favorite fruit?
fields:
  Fruit: favorite_fruit
---
question: |
  What is your favorite fruit?
fields:
  Fruit: favorite_fruit
---
mandatory: True
question: |
  Your favorite fruit is
  ${ favorite_fruit }.
```

[![Image 96: Screenshot of supersede-regular example](https://docassemble.org/img/examples/supersede-regular.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/supersede-regular.yml&reset=1 "Click to try this interview")

If you wanted the first question to be asked instead, you could rearrange the order of questions, but what if you wanted to keep the order the same?

One alternative is to use the `id` and `supersedes` specifiers:

```
id: informal favorite fruit question
supersedes: regular favorite fruit question
question: |
  What the heck is your favorite fruit?
fields:
  Fruit: favorite_fruit
---
id: regular favorite fruit question
question: |
  What is your favorite fruit?
fields:
  Fruit: favorite_fruit
---
mandatory: True
question: |
  Your favorite fruit is
  ${ favorite_fruit }.
```

[![Image 97: Screenshot of supersede example](https://docassemble.org/img/examples/supersede.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/supersede.yml&reset=1 "Click to try this interview")

In this example, the `id` and `supersedes` specifiers tell the interview that the first question takes precedence over the second.

Another way of changing the order of precedence is to use the [`order` initial block](https://docassemble.org/docs/initial.html#order).

Putting conditions on whether a question is applicable[¶](https://docassemble.org/docs/modifiers.html#if)
---------------------------------------------------------------------------------------------------------

If you have multiple [`question`](https://docassemble.org/docs/questions.html#question)s in your interview that define a given variable, you can tell **docassemble** under what conditions a given question may be asked. You do so by using the `if` modifier.

```
question: |
  Describe your intelligence.
field: user_intelligence
choices:
  - Smart
  - Dumb
---
if: |
  user_intelligence == 'Smart'
question: |
  What is the square root of 50% of 32?
fields:
  - Answer: answer
    datatype: integer
---
if: |
  user_intelligence == 'Dumb'
question: |
  What is 2+2?
fields:
  - Answer: answer
    datatype: integer
---
mandatory: True
question: |
  % if answer == 4:
  That is correct.
  % else:
  Wrong answer.
  % endif
```

[![Image 98: Screenshot of if example](https://docassemble.org/img/examples/if.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/if.yml&reset=1 "Click to try this interview")

Here’s how this works:

*   The [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question requires a definition of `answer`, so the interview looks for blocks that offer to define `answer`.
*   The interview considers asking the “What is 2+2?” question. It considers this question first because it appears last in the [YAML](https://en.wikipedia.org/wiki/YAML) source.
*   This question has a condition, so the interview evaluates the [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python). However, the expression depends on the variable `user_intelligence`, which is undefined, so the interview asks a question to determine that value of this variable.
*   When the user answers the `user_intelligence` question, the interview tries to ask the `mandatory` question again, then looks for a definition of `answer`, then considers asking the “What is 2+2?” question, then evaluates the `if` expression.
*   If the expression evaluates to true, then the interview asks “What is 2+2?”
*   If the expression evaluates to false, then the interview skips the question and moves on to the “What is the square root of 50% of 32?” question. It evaluates the `if` statement, and will ask the question if the expression evaluates to true.

The content of the `if` modifier must be a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) or a list of [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python)s. If a list of expressions is provided, each expression must evaluate to true in order for the question to be asked.

Conditionally hiding the Continue button based on a Python expression[¶](https://docassemble.org/docs/modifiers.html#hidecontinuebutton)
----------------------------------------------------------------------------------------------------------------------------------------

Many `question` blocks have “Continue” buttons. If you want the “Continue” button to be hidden in some circumstances, so that the user cannot continue, you can set `hide continue button` to a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) that, if true, will cause the Continue button to be unavailable.

You might use this on a `question` that contains an [action](https://docassemble.org/docs/functions.html#url_action) the user can perform in order to make a correction, which may cause the Continue button to appear.

```
question: |
  % if user_number == number_to_enter:
  You have passed the short-term memory test.
  % else:
  You are wrong.
  % endif
action buttons:
  - label: |
      Try again
    action: user_number
    show if: |
      user_number != number_to_enter
    color: primary
hide continue button: |
  user_number != number_to_enter
continue button field: threshold_screen
```

[![Image 99: Screenshot of hide-continue-button example](https://docassemble.org/img/examples/hide-continue-button.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/hide-continue-button.yml&reset=1 "Click to try this interview")

Note that the condition specified by `hide continue button` is a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python). This expression can only evaluate values of variables that have already been defined.

If you want a Continue button to be shown or hidden based on the values of fields on the screen, you would need to write your own [JavaScript](https://en.wikipedia.org/wiki/JavaScript) to reveal the button. To reveal the button with [JavaScript](https://en.wikipedia.org/wiki/JavaScript), you can run `$("#da-continue-button").show()`.

Note that because the button can be revealed with [JavaScript](https://en.wikipedia.org/wiki/JavaScript), the `hide continue button` feature should be considered cosmetic, not something that you should rely on for enforcing interview logic. A user with experience with [JavaScript](https://en.wikipedia.org/wiki/JavaScript) could figure out how to reveal the button and press it.

Unless you are a [JavaScript](https://en.wikipedia.org/wiki/JavaScript) programmer, you should not use ```
hide
continue button
``` on a `question` that uses `fields`, `choices`, `dropdown`, etc., because the user would have no way to submit the input. `hide continue button` is primarily useful for a screen that should either be either a dead-end screen or a `continue button field` screen, depending on a condition expressed in [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29).

Conditionally disabling the Continue button based on a Python expression[¶](https://docassemble.org/docs/modifiers.html#disablecontinuebutton)
----------------------------------------------------------------------------------------------------------------------------------------------

`disable continue button` is just like [`hide continue button`](https://docassemble.org/docs/modifiers.html#hidecontinuebutton) except that instead of hiding the Continue button, it shows the button with the [disabled attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) set.

```
question: |
  % if user_number == number_to_enter:
  You have passed the short-term memory test.
  % else:
  You are wrong.
  % endif
subquestion: |
  % if user_number != number_to_enter:
  ${ action_button_html(url_action('user_number'), label="Try again") }
  % endif
disable continue button: |
  user_number != number_to_enter
continue button field: threshold_screen
```

[![Image 100: Screenshot of disable-continue-button example](https://docassemble.org/img/examples/disable-continue-button.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/disable-continue-button.yml&reset=1 "Click to try this interview")

To enable the button using [JavaScript](https://en.wikipedia.org/wiki/JavaScript), run `$("#da-continue-button").prop("disabled", false)`.

Turn off variable scanning[¶](https://docassemble.org/docs/modifiers.html#scanforvariables)
-------------------------------------------------------------------------------------------

By default, **docassemble** looks at every block in your interview and automatically discerns what variables each block is capable of setting. Then, when it is evaluating the interview logic, if it encounters an undefined variable it goes through all the blocks that are capable of defining the variable. As discussed above, if there are multiple blocks that are capable of defining a variable, it tries the ones that are later in the file first, unless an [`order` initial block](https://docassemble.org/docs/initial.html#order) or a [`supersedes` modifier](https://docassemble.org/docs/modifiers.html#precedence) alters that order.

Sometimes, however, a block that **docassemble** tries to use to define a variable is one that you don’t **docassemble** to even consider when looking for a way to define a variable.

This is particularly likely to happen when you have code that changes the values of previously-defined variables.

For example, in this interview, the intention is that:

*   A variable is gathered from the user
*   The variable is reported back to the user
*   Then variable is changed through code
*   The variable is reported to the user again.

```
question: |
  What is the best color?
fields:
  - Color: best_color
---
question: |
  What is the time of day?
field: time_of_day
choices:
  - Night
  - Day
---
mandatory: True
question: |
  The best color is
  ${ best_color }.
field: initial_color_seen
---
mandatory: True
code: |
  if time_of_day == 'Night':
    best_color = 'black'
  else:
    best_color = 'blue'
---
mandatory: True
question: |
  The best color is now
  ${ best_color }.
```

[![Image 101: Screenshot of scan-for-variables-original example](https://docassemble.org/img/examples/scan-for-variables-original.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/scan-for-variables-original.yml&reset=1 "Click to try this interview")

However, this interview does something the interview developer did not intend: when it goes looking for a definition for `best_color`, the first thing it does is run the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) code block that depends on `time_of_day`. So the first question that gets asked is `time_of_day`, not `best_color`. “Ugh!” the developer thinks, “that’s not what I wanted! I only wanted that mandatory code block to be run later in the interview.”

To fix this problem, the developer can modify the code block with `scan for variables: False`:

```
question: |
  What is the best color?
fields:
  - Color: best_color
---
question: |
  What is the time of day?
field: time_of_day
choices:
  - Night
  - Day
---
mandatory: True
question: |
  The best color is
  ${ best_color }.
field: initial_color_seen
---
scan for variables: False
mandatory: True
code: |
  if time_of_day == 'Night':
    best_color = 'black'
  else:
    best_color = 'blue'
---
mandatory: True
question: |
  The best color is now
  ${ best_color }.
```

[![Image 102: Screenshot of scan-for-variables example](https://docassemble.org/img/examples/scan-for-variables.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/scan-for-variables.yml&reset=1 "Click to try this interview")

Now, when **docassemble** goes searching for a block that will define `best_color`, it will disregard the [`code`](https://docassemble.org/docs/code.html#code) block that depends on `time_of_day`.

This modifier can be used on any block that sets variables to make it effectively “invisible” to **docassemble**’s automatic logic. If a block is marked with `scan for variables: False`, the [`event`](https://docassemble.org/docs/fields.html#event) and [`sets`](https://docassemble.org/docs/modifiers.html#sets) modifiers will still be effective, so you can use them to explicitly indicate that a block should be tried when the interview needs a definition of a particular variable.

In this variation of the interview, for example, we first want to gather `best_color` from the user. Then we want to determine `best_thing` based on the time of day, and we want a side effect of setting `best_thing` to be setting `best_color` to something different.

```
question: |
  What is the best color?
fields:
  - Color: best_color
---
question: |
  What is the time of day?
field: time_of_day
choices:
  - Night
  - Day
---
scan for variables: False
sets:
  - best_thing
code: |
  if time_of_day == 'Night':
    best_thing = 'astronomy'
    best_color = 'black'
  else:
    best_thing = 'the beach'
    best_color = 'blue'
---
mandatory: True
field: initial_screen
question: |
  According to you, the best color
  is ${ best_color }.
---
mandatory: True
question: |
  Since the best thing is
  ${ best_thing }, the best color is
  ${ best_color }.
```

[![Image 103: Screenshot of scan-for-variables-sets example](https://docassemble.org/img/examples/scan-for-variables-sets.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/scan-for-variables-sets.yml&reset=1 "Click to try this interview")

If we did not use `scan for variables: False`, then the interview would never ask the user for `best_color`; the [`code`](https://docassemble.org/docs/code.html#code) block would have been used to get an initial definition of `best_color`. But by turning off automatic variable scanning and explicitly indicating that the [`code`](https://docassemble.org/docs/code.html#code) block should only be used for determining the definition of `best_thing`, we were able to get the interview to behave the way we wanted it to.

If you want to use `scan for variables: False` along with [`sets`](https://docassemble.org/docs/modifiers.html#sets), a shorthand is to use [`only sets`](https://docassemble.org/docs/modifiers.html#onlysets).

```
question: |
  What is the best color?
fields:
  - Color: best_color
---
question: |
  What is the time of day?
field: time_of_day
choices:
  - Night
  - Day
---
only sets: best_thing
code: |
  if time_of_day == 'Night':
    best_thing = 'astronomy'
    best_color = 'black'
  else:
    best_thing = 'the beach'
    best_color = 'blue'
---
mandatory: True
field: initial_screen
question: |
  According to you, the best color
  is ${ best_color }.
---
mandatory: True
question: |
  Since the best thing is
  ${ best_thing }, the best color is
  ${ best_color }.
```

[![Image 104: Screenshot of only-sets example](https://docassemble.org/img/examples/only-sets.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/only-sets.yml&reset=1 "Click to try this interview")

Indicate variables that are prerequisites[¶](https://docassemble.org/docs/modifiers.html#need)
----------------------------------------------------------------------------------------------

You can add a `need` specifier to a block to indicate that before the block is used, the definitions of one or more variables must be obtained. This specifier is explained in the [`need`](https://docassemble.org/docs/logic.html#need) subsection of the [Logic section](https://docassemble.org/docs/logic.html).

Indicate prerequisite variables that invalidate a block[¶](https://docassemble.org/docs/modifiers.html#dependson)
-----------------------------------------------------------------------------------------------------------------

You can add a [`depends on`](https://docassemble.org/docs/logic.html#depends%20on) specifier to a block to indicate a list of variables that, when changed, should invalidate the variables set by the block. It also indicates that the listed variables should be asked first (the functionality of the [`need`](https://docassemble.org/docs/logic.html#need) modifier). This specifier is explained in the [`depends on`](https://docassemble.org/docs/logic.html#depends%20on) subsection of the [Logic section](https://docassemble.org/docs/logic.html).

Undefine variables when a `question` is asked[¶](https://docassemble.org/docs/modifiers.html#undefine)
------------------------------------------------------------------------------------------------------

You can add an `undefine` specifier to a block to indicate that before the block is used, one or more variables must be undefined if they are defined. This specifier is explained in the [`undefine`](https://docassemble.org/docs/logic.html#undefine) subsection of the [Logic section](https://docassemble.org/docs/logic.html).

Obtain new values of variables when a `question` is asked[¶](https://docassemble.org/docs/modifiers.html#reconsider)
--------------------------------------------------------------------------------------------------------------------

You can add a `reconsider` specifier to a block to indicate that before the block is used, the definitions of one or more variables must be obtained and re-obtained if they are already obtained. This specifier is explained in the [`reconsider`](https://docassemble.org/docs/logic.html#reconsider) subsection of the [Logic section](https://docassemble.org/docs/logic.html).

Include additional buttons on the screen[¶](https://docassemble.org/docs/modifiers.html#actionbuttons)
------------------------------------------------------------------------------------------------------

The [`action buttons`](https://docassemble.org/docs/questions.html#action%20buttons) modifier allows you to include additional buttons on the screen.

To make a note to yourself about a question, which will not be seen by the end user, you can use a `comment` specifier. It will be ignored by **docassemble**, so it can contain any valid [YAML](https://en.wikipedia.org/wiki/YAML).

```
question: |
  Do you agree the weather
  is nice today? 
yesno: day_is_nice
comment: |
  We might wish to consider
  taking out this question.
  It does not seem necessary.
```

[![Image 105: Screenshot of comment-weather example](https://docassemble.org/img/examples/comment-weather.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/comment-weather.yml&reset=1 "Click to try this interview")
