Title: Overview of docassemble

URL Source: https://docassemble.org/docs.html

Markdown Content:
*   [1 Introduction to docassemble](https://docassemble.org/docs.html#intro)
*   [2 Using the documentation](https://docassemble.org/docs.html#usingdocumentation)
*   [3 Sections of the documentation](https://docassemble.org/docs.html#toc)

**docassemble** is a platform for creating mobile-friendly web applications called [Interviews](https://docassemble.org/docs/interviews.html) that ask one question at a time in order to reach an end point. This end point may be the presentation of advice, the creation of a signed document, the submission of an application, or something else. Run the [Demonstration](https://docassemble.org/demo.html) to get an idea for what **docassemble** applications look like.

You can run **docassemble** on your laptop, but most people run it “in the cloud” on [Amazon Web Services](https://aws.amazon.com/ec2/), [Digital Ocean](https://www.digitalocean.com/), or another hosting service. The [Deploy](https://docassemble.org/deploy.html) page describes a variety of ways you can get your own **docassemble** instance up and running. You can install **docassemble** on a server using [Docker](https://docassemble.org/docs/docker.html) or (if you are an expert) follow the detailed [Installation](https://docassemble.org/docs/installation.html) instructions. For the most part, the [Administration](https://docassemble.org/docs/admin.html) and [Configuration](https://docassemble.org/docs/config.html) of **docassemble** can be handled through the web interface.

Introduction to **docassemble**[¶](https://docassemble.org/docs.html#intro)
---------------------------------------------------------------------------

Interview developers write interviews in [YAML](https://en.wikipedia.org/wiki/YAML) format, a plain-text format that is human-readable but also machine-readable.

An interview consists of multiple “blocks.” Blocks are pieces of text separated by `---`, which is a record separator in [YAML](https://en.wikipedia.org/wiki/YAML). For example:

```
question: Do you like turnips?
yesno: likes_turnips
---
question: When did you stop idolizing worms?
fields:
  - Date: worm_idolizing_stop_date
    datatype: date
```

[![Image 3: Screenshot of turnips-worms example](https://docassemble.org/img/examples/turnips-worms.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/turnips-worms.yml&reset=1 "Click to try this interview")

You can click the screenshot above to see this interview in action. If you hover over the source code, three dots will appear in the lower-right corner; if you click the three dots, you can see full interview [YAML](https://en.wikipedia.org/wiki/YAML) behind the sample interview.

Some blocks are [Question Blocks](https://docassemble.org/docs/questions.html) that represent screens that the user will actually see. (Two examples are above.) The basic structure of question blocks is simple, but there are a lot of possible [Question Modifiers](https://docassemble.org/docs/modifiers.html) that can make your screens do different things.

The information gathered from users is stored in “variables,” and the purpose of most question blocks will be [Setting Variables](https://docassemble.org/docs/fields.html). You can use whatever variable names you want, except you can’t use the names of [Special Variables](https://docassemble.org/docs/special.html) that already have their own meaning.

**docassemble** supports [many different types](https://docassemble.org/docs/fields.html#data%20types) of variables – even [file uploads](https://docassemble.org/docs/fields.html#file) and [touchscreen signatures](https://docassemble.org/docs/fields.html#signature). One of the most powerful features is the ability to store information in a structured way using [Objects](https://docassemble.org/docs/objects.html). When you want to collect one or more pieces of related information, you can collect the information into [Groups](https://docassemble.org/docs/groups.html) such as [lists](https://docassemble.org/docs/groups.html#gather%20list) and [dictionaries](https://docassemble.org/docs/groups.html#gather%20dictionary).

There are other types of blocks besides [`question`](https://docassemble.org/docs/questions.html#question) blocks.

[Initial Blocks](https://docassemble.org/docs/initial.html) set interview-wide options, like the special [features](https://docassemble.org/docs/initial.html#features) of an interview, or the default [screen parts](https://docassemble.org/docs/questions.html#screen%20parts).

[Code](https://docassemble.org/docs/code.html) blocks allow you to set variables through computation. Code is written in [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29). To write an interview, you do not need to know much about [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) except how to write “if/then/else” statements.

```
code: |
  if plaintiff.county == defendant.county:
    jurisdiction_is_proper = True
```

You can even use “fuzzy logic” with **docassemble**’s [Machine Learning](https://docassemble.org/docs/ml.html) feature.

**docassemble** decides which questions to ask, and the order in which to ask them, according to the [Interview Logic](https://docassemble.org/docs/logic.html). You can specify the order of questions with great specificity if you want, or you can just specify an end goal and let **docassemble** figure everything out on its own.

A popular use of interviews is the assembly of [Documents](https://docassemble.org/docs/documents.html) (hence the name **docassemble**). You can write document templates in [DOCX](https://docassemble.org/docs/documents.html#docx%20template%20file) or [PDF](https://docassemble.org/docs/documents.html#pdf%20template%20file) formats. You can also write documents the same way you write questions, in plain text using [Markup](https://docassemble.org/docs/markup.html) to indicate formatting.

As your interviews become more sophisticated, you will find it useful to invoke [Functions](https://docassemble.org/docs/functions.html) to do things like conjugate verbs, compute differences between dates, or offer the user hyperlinks that perform special [actions](https://docassemble.org/docs/functions.html#actions).

**docassemble** uses a [User Login](https://docassemble.org/docs/users.html) system that allows users to create accounts, save their answers, and resume their interviews at a later date.

Since **docassemble** is a free and open-source application, it is designed to be interoperable with other applications. There are a variety of ways to work with [External Data](https://docassemble.org/docs/external.html); you can move information easily into and out of a **docassemble** interview session. There is also a full-featured [API](https://docassemble.org/docs/api.html) for interacting with **docassemble** programmatically. You can also design your own [Custom Front Ends](https://docassemble.org/docs/frontend.html).

Developers can prototype and test their interviews in the browser, using the interview developers’ [Playground](https://docassemble.org/docs/playground.html).

Once you get a **docassemble** server [up and running](https://docassemble.org/deploy.html), go through the [Hello World](https://docassemble.org/docs/helloworld.html) tutorial to learn more about how interviews work. As you become more experienced using the system, you may want to explore using other [Development Workflows](https://docassemble.org/docs/development.html) than just the [Playground](https://docassemble.org/docs/playground.html).

One of **docassemble**’s most powerful features is its ability to operate multi-user interviews through the [Roles](https://docassemble.org/docs/roles.html) feature. For example, a user could fill out an interview and then an attorney could enter the interview to evaluate the information and provide legal advice, which the user would see the next time they log in.

Using the [Background Tasks](https://docassemble.org/docs/background.html) features, you can have your interviews do things on the server at times other than when the user presses a button to advance to a new page. Time-intensive tasks can run in the [background](https://docassemble.org/docs/background.html#background). The interview can [evaluate user input](https://docassemble.org/docs/background.html#check%20in) before the user clicks the Continue button. Interviews can do things [when the user is not logged in](https://docassemble.org/docs/background.html#scheduled), like send a reminder [e-mail](https://docassemble.org/docs/functions.html#send_email) to a user about a deadline as the date approaches.

**docassemble** is a multi-purpose platform, but it is particularly designed for [Legal Applications](https://docassemble.org/docs/legal.html), and has special functionality for that specific purpose.

If you need to make an interview available in more than one language, **docassemble**’s [Language Support](https://docassemble.org/docs/language.html) features can help you manage translations. **docassemble** also has a number of features for [Accessibility](https://docassemble.org/docs/accessibility.html) by persons with disabilities.

**docassemble** was built on the model of the open-source software development world. Interviews can be bundled into [Packages](https://docassemble.org/docs/packages.html), which can be shared on [GitHub](https://github.com/) or moved between servers as ZIP files.

The mobile-friendly web interface is the primary way that users will run interviews, but there is also the option of making interviews available via [Text Messaging](https://docassemble.org/docs/sms.html).

When you deploy your interviews, there are a variety of ways you can provide support to your users. The [Live Help](https://docassemble.org/docs/livehelp.html) features allow operators to communicate with users using on-line chat. Operators can see users’ screens and even take control if necessary. If communication by phone is necessary, operators can provide users with a special phone number and code that forwards a call without revealing the operator’s actual phone number.

**docassemble** has excellent [Scalability](https://docassemble.org/docs/scalability.html) when deployed in the cloud, so you don’t have to worry about what will happen if your interviews get a lot of traffic.

If your interviews will process sensitive information, **docassemble** has a number of [Security](https://docassemble.org/docs/security.html) features to keep that information safe, such as server-side encryption.

Developers will invariably make mistakes and encounter [Errors](https://docassemble.org/docs/errors.html). **docassemble** tries to provide helpful error messages in the browser or in logs stored on the server.

If you get stuck, you can seek out [Support](https://docassemble.org/docs/support.html) from the **docassemble** community, in particular by posting a question on the **docassemble** [Slack](https://join.slack.com/t/docassemble/shared_invite/zt-2cspzjo9j-YyE7SrLmi5muAvnPv~Bz~A). You might also find that there is an example interview in the [Recipes](https://docassemble.org/docs/recipes.html) that will help you solve your problem.

**docassemble** is free software available with a highly permissive open-source [License](https://docassemble.org/docs/license.html). The software is updated frequently, and you can see what new features are available by reading the [Change Log](https://docassemble.org/docs/changelog.html).

Note that if you have been using **docassemble** for a long time, you need learn about the necessity of doing a [Python Upgrade](https://docassemble.org/docs/twotothree.html).

Using the documentation[¶](https://docassemble.org/docs.html#usingdocumentation)
--------------------------------------------------------------------------------

The **docassemble** documentation is intended more as a reference guide than as a manual that you have to read before getting started.

The best way to learn about **docassemble** is to start creating your own interview. Start by following along with the “Hello, world” [tutorial](https://docassemble.org/docs/helloworld.html) that explains how to create a simple interview. Once you get that working, you can experiment with adding more questions to it.

The best way to learn about more advanced **docassemble** features is to study working examples. The sections of this documentation site contain a number of side-by-side examples comparing source code to screenshots. You can click on the screenshots to run the interviews. The code next to the screenshots is often only an excerpt of the full interview. To see the full source code of the interview, hover over the source code and click the button that appears in the lower right corner. In addition, while you are developing interviews in the [Playground](https://docassemble.org/docs/playground.html), you can browse working examples of many of **docassemble**’s features.

There is also a full-featured sample interview linked from the [demonstration page](https://docassemble.org/demo.html). While you are using the interview you can click “Source” in the navigation bar to toggle display of the source code for the question and an explanation of the path **docassemble** took to decide to ask that question.

Sections of the documentation[¶](https://docassemble.org/docs.html#toc)
-----------------------------------------------------------------------

*   Tutorial

*   [Hello World](https://docassemble.org/docs/helloworld.html)

*   Authoring guide

*   [Interviews](https://docassemble.org/docs/interviews.html)
*   [Initial Blocks](https://docassemble.org/docs/initial.html)
*   [Question Blocks](https://docassemble.org/docs/questions.html)
*   [Setting Variables](https://docassemble.org/docs/fields.html)
*   [Question Modifiers](https://docassemble.org/docs/modifiers.html)
*   [Code](https://docassemble.org/docs/code.html)
*   [Interview Logic](https://docassemble.org/docs/logic.html)
*   [Markup](https://docassemble.org/docs/markup.html)
*   [Documents](https://docassemble.org/docs/documents.html)
*   [Objects](https://docassemble.org/docs/objects.html)
*   [Groups](https://docassemble.org/docs/groups.html)
*   [Functions](https://docassemble.org/docs/functions.html)
*   [External Data](https://docassemble.org/docs/external.html)
*   [Legal Applications](https://docassemble.org/docs/legal.html)
*   [Special Variables](https://docassemble.org/docs/special.html)

*   Special features

*   [Language Support](https://docassemble.org/docs/language.html)
*   [Accessibility](https://docassemble.org/docs/accessibility.html)
*   [Roles](https://docassemble.org/docs/roles.html)
*   [Background Code](https://docassemble.org/docs/background.html)
*   [Machine Learning](https://docassemble.org/docs/ml.html)
*   [SMS Interface](https://docassemble.org/docs/sms.html)
*   [API](https://docassemble.org/docs/api.html)
*   [Custom Front Ends](https://docassemble.org/docs/frontend.html)

*   Users

*   [User Login](https://docassemble.org/docs/users.html)
*   [Live Help](https://docassemble.org/docs/livehelp.html)

*   Development

*   [Overview](https://docassemble.org/docs/development.html)
*   [Playground](https://docassemble.org/docs/playground.html)
*   [Packages](https://docassemble.org/docs/packages.html)
*   [UI Customization](https://docassemble.org/docs/ui.html)
*   [Debugging](https://docassemble.org/docs/errors.html)
*   [Support](https://docassemble.org/docs/support.html)
*   [Future](https://docassemble.org/docs/future.html)
*   [Recipes](https://docassemble.org/docs/recipes.html)

*   Administration

*   [Overview](https://docassemble.org/docs/admin.html)
*   [Installation](https://docassemble.org/docs/installation.html)
*   [Docker](https://docassemble.org/docs/docker.html)
*   [Configuration](https://docassemble.org/docs/config.html)
*   [Scalability](https://docassemble.org/docs/scalability.html)
*   [Security](https://docassemble.org/docs/security.html)
*   [Change Log](https://docassemble.org/docs/changelog.html)
*   [Contributing](https://docassemble.org/docs/contributing.html)
*   [Policies](https://docassemble.org/docs/policies.html)
*   [License](https://docassemble.org/docs/license.html)
