Title: Interview logic

URL Source: https://docassemble.org/docs/logic.html

Markdown Content:
*   [1 Introduction](https://docassemble.org/docs/logic.html#intro)
    *   [1.1 Simple interviews: all blocks mandatory](https://docassemble.org/docs/logic.html#intro_mandatory)
    *   [1.2 Complex interviews: dependency satisfaction](https://docassemble.org/docs/logic.html#intro_dependency)
    *   [1.3 Manually specifying the order of questions](https://docassemble.org/docs/logic.html#intro_manual_order)
    *   [1.4 Writing law as code to drive the interview](https://docassemble.org/docs/logic.html#legal_logic)
*   [2 How rules determine interview process](https://docassemble.org/docs/logic.html#interview_logic)
    *   [2.1 Beware of non-idempotency](https://docassemble.org/docs/logic.html#idempotency)
*   [3 The logical order of an interview](https://docassemble.org/docs/logic.html#order)
    *   [3.1 Overriding one question with another](https://docassemble.org/docs/logic.html#overriding)
    *   [3.2 Fallback questions](https://docassemble.org/docs/logic.html#fallback)
*   [4 How docassemble runs your code](https://docassemble.org/docs/logic.html#howitworks)
*   [5 How docassemble finds questions for variables](https://docassemble.org/docs/logic.html#variablesearching)
*   [6 Specifiers that control interview logic](https://docassemble.org/docs/logic.html#specifiers)
    *   [6.1 mandatory](https://docassemble.org/docs/logic.html#mandatory)
    *   [6.2 initial](https://docassemble.org/docs/logic.html#initial)
    *   [6.3 need](https://docassemble.org/docs/logic.html#need)
    *   [6.4 depends on](https://docassemble.org/docs/logic.html#dependson)
    *   [6.5 reconsider](https://docassemble.org/docs/logic.html#reconsider)
    *   [6.6 undefine](https://docassemble.org/docs/logic.html#undefine)
*   [7 Combining multiple interviews into one](https://docassemble.org/docs/logic.html#multipleinterviews)
    *   [7.1 Using an umbrella YAML file](https://docassemble.org/docs/logic.html#multipleinterviewsumbrella)
    *   [7.2 Using hyperlinks](https://docassemble.org/docs/logic.html#multipleinterviewslinks)
    *   [7.3 A/B testing with redirects](https://docassemble.org/docs/logic.html#multipleinterviewsredirect)
    *   [7.4 Using multiple endpoints in a single interview](https://docassemble.org/docs/logic.html#subinterview)
*   [8 Best practices for interview logic and organization](https://docassemble.org/docs/logic.html#bplogic)
*   [9 Best practices for sharing with others](https://docassemble.org/docs/logic.html#bpsharing)

Introduction[¶](https://docassemble.org/docs/logic.html#intro)
--------------------------------------------------------------

Unlike other guided interview systems, in which the interview developer maps out a decision tree or flowchart to indicate which questions should be asked and in which order, **docassemble** figures out what questions to ask and when to ask them based on rules that you specify. You specify these rules using [YAML](https://en.wikipedia.org/wiki/YAML) blocks.

Simple interviews: all blocks mandatory[¶](https://docassemble.org/docs/logic.html#intro_mandatory)
---------------------------------------------------------------------------------------------------

The simplest type of rule you can specify is marking a block as [`mandatory`](https://docassemble.org/docs/logic.html#mandatory).

```
mandatory: True
question: |
  Welcome to the interview!
continue button field: intro
---
mandatory: True
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
---
mandatory: True
question: |
  What is your favorite vegetable?
fields:
  - Vegetable: favorite_vegetable
---
mandatory: True
question: |
  Here is your document.
attachment:
  content: |
    Your favorite fruit is ${ favorite_fruit }.

    % if favorite_fruit == 'apple':
    You will never need to see a doctor.

    % endif
    Your favorite vegetable is ${ favorite_vegetable }.
```

[![Image 45: Screenshot of all-mandatory example](https://docassemble.org/img/examples/all-mandatory.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/all-mandatory.yml&reset=1 "Click to try this interview")

When **docassemble** runs an interview, it looks at the [YAML](https://en.wikipedia.org/wiki/YAML) and tries to run each block that is marked as “mandatory.” It will run them in the order in which they appear in the [YAML](https://en.wikipedia.org/wiki/YAML). In this example, first the “Welcome to the interview!” [`question`](https://docassemble.org/docs/questions.html#question) is asked. When the user clicks the “Continue” button, **docassemble** moves on to the second [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block, which asks “What is your favorite fruit?” When that question is answered, **docassemble** asks “What is your favorite vegetable?” When that question is answered **docassemble** moves on to the final [`question`](https://docassemble.org/docs/questions.html#question), “Here is your document,” which lets the user download a document. This is a very simple interview because there is no branching logic.

Suppose that instead of asking for the user’s favorite vegetable, you wanted to ask for the user’s favorite apple, but only if the user said that their favorite fruit is “apple.” In the previous interview, we set [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) to `True` every time, but we can actually set [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) to a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) that evaluates to a true or false value. For example:

```
mandatory: True
question: |
  Welcome to the interview!
continue button field: intro
---
mandatory: True
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
---
mandatory: favorite_fruit == 'apple'
question: |
  What is your favorite type of apple?
fields:
  - Type of apple: favorite_apple
---
mandatory: True
question: |
  Here is your document.
attachment:
  content: |
    Your favorite fruit is ${ favorite_fruit }.

    % if favorite_fruit == 'apple':
    Your favorite type of apple is ${ favorite_apple }.

    % endif
```

[![Image 46: Screenshot of branch-mandatory example](https://docassemble.org/img/examples/branch-mandatory.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/branch-mandatory.yml&reset=1 "Click to try this interview")

Here, the “What is your favorite type of fruit” [`question`](https://docassemble.org/docs/questions.html#question) is only “mandatory” if the user says that `apple` is their favorite type of fruit. Thus, if the `favorite_fruit` variable is `'banana'`, then **docassemble** will skip over the “What is your favorite type of apple?” [`question`](https://docassemble.org/docs/questions.html#question) and proceed directly to the “Here is your document” [`question`](https://docassemble.org/docs/questions.html#question).

By setting the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) directive to a [Python expression](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) that uses variables defined in previous [`question`](https://docassemble.org/docs/questions.html#question) blocks, you can write complex interviews that branch in a lot of different directions depending on the interview answers.

However, in a complex interview with a number of nested branches of logic, the [Python expressions](https://stackoverflow.com/questions/4782590/what-is-an-expression-in-python) you will need to write to indicate whether a [`question`](https://docassemble.org/docs/questions.html#question) should be asked could be very long and complicated. In the next section, we will discuss another way of implementing branching logic that avoids this complication.

Complex interviews: dependency satisfaction[¶](https://docassemble.org/docs/logic.html#intro_dependency)
--------------------------------------------------------------------------------------------------------

As explained in the previous section, when **docassemble** runs your interview, it goes through your [YAML](https://en.wikipedia.org/wiki/YAML) from beginning to end and attempts to run each block that is marked as [`mandatory`](https://docassemble.org/docs/logic.html#mandatory). Marking a [`question`](https://docassemble.org/docs/questions.html#question) as “mandatory” is one way to tell **docassemble** you want a [`question`](https://docassemble.org/docs/questions.html#question) to be displayed.

**docassemble** can also do “dependency satisfaction.” For example, you can write an interview like this:

```
mandatory: True
question: |
  Your favorite fruit is ${ favorite_fruit }.
subquestion: |
  % if favorite_fruit == 'grapes':
  Your favorite vineyard is ${ favorite_vineyard }.
  % endif
---
question: |
  Which vineyard do you think produces the best grapes?
fields:
  - Vineyard: favorite_vineyard
---
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
```

[![Image 47: Screenshot of dependency-demo example](https://docassemble.org/img/examples/dependency-demo.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/dependency-demo.yml&reset=1 "Click to try this interview")

In this interview, there is a mandatory question and then two questions that do not have a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) directive on them. If you run the interview, the first question asked is “What is your favorite fruit?” How did **docassemble** know it needed to ask that question, even though it was not marked as [`mandatory`](https://docassemble.org/docs/logic.html#mandatory)? What happened was that **docassemble** tried to display the “Your favorite fruit is …” question, but in the process of doing so, it encountered an undefined variable `favorite_fruit`. So then it looked for a block that defines the ‘favorite\_fruit’ variable, and it found one, so it asked the “What is your favorite fruit?” question.

If the user types `grapes` in answer to that question, the interview asks a follow-up question, “Which vineyard do you think produces the best grapes?” and then proceeds to the final screen, which says “Your favorite fruit is grapes.” However, if the user says their favorite fruit is “apples,” the interview will skip the “Which vineyard do you think produces the best grapes?” question and will proceed directly to the final screen, which says “Your favorite fruit is apples.” Thus, with a single [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question, the interview does branching logic.

The branching logic is a by-product of the attempt to display the single [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question. If you were to change the text of the question and remove the reference to `favorite_vineyard`, the “Which vineyard do you think produces the best grapes?” question would never be asked. Or, if you were to change the `question` text to ```
Your
favorite fruit is ${ favorite_fruit } and your favorite vegetable is
${ favorite_vegetable }.
``` then the order of questions would change, and the question that defines `favorite_vegetable` question would be asked right after the `favorite_fruit` question. When dependency satisfaction is used to ask questions, the order of questions is determined by which variables **docassemble** sees first.

Note that the order in which non-[`mandatory`](https://docassemble.org/docs/logic.html#mandatory) questions appear in the [YAML](https://en.wikipedia.org/wiki/YAML) does not affect the order in which questions are asked. Each block in in your [YAML](https://en.wikipedia.org/wiki/YAML) is a just a “rule,” and you can specify as many “rules” in your [YAML](https://en.wikipedia.org/wiki/YAML) as you want, in any order.

For example, the following block is a rule that indicates whether the user is eligible for a benefit.

```
code: |
  if user.age_in_years() >= 60 or user.is_disabled:
    user.eligible = True
  else:
    user.eligible = False
```

The rule says that the user is eligible if they are 60 or older, or if they are disabled, otherwise the user is not eligible.

Rules in **docassemble** are instructions for how to define a particular variable. The [`code`](https://docassemble.org/docs/code.html) block above is a rule for how to define `user.eligible`. [`question`](https://docassemble.org/docs/questions.html#question) blocks are also rules. Here is a rule that specifies how to define `user.is_disabled`:

```
question: Are you disabled?
yesno: user.is_disabled
```

This says that the rule for defining `user.disabled` is to ask the user a yes/no question.

It is possible to specify rules in fairly complex ways, as we will see later; you can write multiple blocks that define the same variable, so you can have alternative rules for different circumstances, or you can have a general rule that is overridden by a more specific rule in certain circumstances. You can write generic rules that apply to a variety of different variables.

When **docassemble** runs your interview, it will try to run your [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks, in the order in which the blocks appear in your [YAML](https://en.wikipedia.org/wiki/YAML). In the course of trying to run a block, **docassemble** might encounter a variable that hasn’t been defined yet. When this happens, **docassemble** will evaluate the “rules” you have defined, and it will run [`code`](https://docassemble.org/docs/code.html) blocks, [`question`](https://docassemble.org/docs/questions.html#question) blocks, or other types of blocks in order to try to obtain a definition of the undefined variable.

In the course of trying to define a variable, **docassemble** might encounter yet another undefined variable, in which case it will try to obtain a definition of that variable, and in the course of trying to define that variable, it may encounter yet another undefined variable. A rule that defines a variable may “depend on” the values of other variables. **docassemble**’s logic engine will perform “dependency satisfaction” by automatically figuring out what variable definitions are necessary and running the appropriate [`code`](https://docassemble.org/docs/code.html) blocks or showing the appropriate [`question`](https://docassemble.org/docs/questions.html#question) screens to the user.

This allows you, as the interview author, to specify rules and use variables in your interview or in your documents as you see fit, while **docassemble** does all the thinking about which questions need to be asked and in what order to ask them.

**docassemble** automatically refrains from asking unnecessary questions. For example, consider this example:

```
code: |
  if user.age_in_years() >= 60 or user.is_disabled:
    user.eligible = True
  else:
    user.eligible = False
```

If the user is 60 or older, there is no need to ask the user if they are disabled. It would waste the user’s time to ask that question. **docassemble** infers this from the rule. Thus “how to conduct the interview” and “what the legal rules are” are effectively the same thing, and can be specified in a single location.

Manually specifying the order of questions[¶](https://docassemble.org/docs/logic.html#intro_manual_order)
---------------------------------------------------------------------------------------------------------

Sometimes, you might not want the order of questions in the interview to be implicitly determined by the way **docassemble** processes rules; you might want to explicitly specify the order of questions. You can do this using a [`code`](https://docassemble.org/docs/code.html) block.

```
mandatory: True
code: |
  if favorite_fruit == 'grapes':
    favorite_vineyard
  favorite_vegetable
  final_screen
---
event: final_screen
question: |
  Your favorite fruit is ${ favorite_fruit }.
subquestion: |
  Your favorite vegetable is ${ favorite_vegetable }.

  % if favorite_fruit == 'grapes':
  Your favorite vineyard is ${ favorite_vineyard }.
  % endif
---
question: |
  Which vineyard do you think produces the best grapes?
fields:
  - Vineyard: favorite_vineyard
---
question: |
  What is your favorite fruit?
fields:
  - Fruit: favorite_fruit
---
question: |
  What is your favorite vegetable?
fields:
  - Vegetable: favorite_vegetable
```

[![Image 48: Screenshot of dependency-demo-code example](https://docassemble.org/img/examples/dependency-demo-code.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/dependency-demo-code.yml&reset=1 "Click to try this interview")

In this interview, the mandatory [`code`](https://docassemble.org/docs/code.html) block drives the interview using dependency satisfaction, but in an explicit order. This block contains a few lines of [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code. The first variable encountered is `favorite_fruit`, which means that the `favorite_fruit` question will be asked. If `favorite_fruit` is `'grapes'`, then `favorite_vineyard` is evaluated, which means that `favorite_vineyard` will be asked. Then `favorite_vegetable` is asked, and then `final_screen` is sought. Because `final_screen` is a special screen, and the `event` directive is set to `final_screen`, the variable `final_screen` will actually not be defined; the screen is a dead-end screen with no fields and no “Continue” button.

If the mandatory [`code`](https://docassemble.org/docs/code.html) block was not present, and instead the `final_screen` block was marked [`mandatory`](https://docassemble.org/docs/logic.html#mandatory), then the questions would have been asked in a different order: first `favorite_fruit`, then `favorite_vegetable`, and then `favorite_vineyard` (if the `favorite_fruit` was `'grapes'`). We were able to instruct **docassemble** to ask for `favorite_vineyard` immediately after `favorite_fruit` by specifying different interview logic in the [`code`](https://docassemble.org/docs/code.html) block.

This mandatory [`code`](https://docassemble.org/docs/code.html) block serves as an “outline” for the interview. Instead of ordering blocks in your [YAML](https://en.wikipedia.org/wiki/YAML), you can simply order lines in your mandatory [`code`](https://docassemble.org/docs/code.html) block. The [`code`](https://docassemble.org/docs/code.html) block lets you see the order of your interview at a glance, without having to page through a long interview. The indentation of text under `if` statements makes clear where there is a “branch” in the logic.

If you are familiar with [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29), you might think that the mandatory [`code`](https://docassemble.org/docs/code.html) block is weird, because simply putting the name of a variable by itself on a line doesn’t do anything; it’s not something that programmers normally do. However, it does something in **docassemble**, because if the variable is undefined, a [Python exception](https://docs.python.org/3/tutorial/errors.html) will be “raised,” and the raising of that exception will tell **docassemble** that a definition of that variable needs to be obtained. **docassemble**’s dependency satisfaction system operates through the triggering of undefined variable exceptions.

So far, we have discussed three different techniques for specifying interview logic in **docassemble**:

1.  A series of [`question`](https://docassemble.org/docs/questions.html#question) blocks with [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) directives on them;
2.  Allowing `question` blocks to be asked implicitly as a result of dependency satisfaction; and
3.  Writing a [`code`](https://docassemble.org/docs/code.html) block marked as [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) containing an explicit outline of the variables that need to be gathered and the conditions under which each variable definition should be sought.

These three techniques are not mutually exclusive; you can use them together. For example, you might have a mandatory [`question`](https://docassemble.org/docs/questions.html#question) block followed by a mandatory [`code`](https://docassemble.org/docs/code.html) block, followed by a mandatory [`question`](https://docassemble.org/docs/questions.html#question) block.

```
mandatory: True
question: |
  Welcome!
continue button field: intro_screen
---
mandatory: True
code: |
  intro_screen
  user.name.first
  final_screen
---
mandatory: True
question: |
  Your preferences.
subquestion: |
  Your favorite fruit is ${ favorite_fruit }.

  Your favorite vegetable is ${ favorite_vegetable }.

  % if favorite_vegetable == 'turnip' and user.grows_own_turnips:
  I grow turnips too!
  % endif
```

Or you could have a mandatory [`code`](https://docassemble.org/docs/code.html) block that only partially specifies the order of questions, and allows many questions to be asked explicitly. For example:

```
mandatory: True
code: |
  intro_screen
  user.name.first
  final_screen
---
question: |
  Welcome!
continue button field: intro_screen
---
event: final_screen
question: |
  Your preferences.
subquestion: |
  Your favorite fruit is ${ favorite_fruit }.

  Your favorite vegetable is ${ favorite_vegetable }.

  % if favorite_vegetable == 'turnip' and user.grows_own_turnips:
  I grow turnips too!
  % endif
```

Here, the mandatory [`code`](https://docassemble.org/docs/code.html) block ensures that `intro_screen` and `user.name.first` are asked up front, but then uses dependency satisfaction to trigger the asking of `favorite_fruit` and `favorite_vegetable`, as well as the display of the `final_screen`.

Writing law as code to drive the interview[¶](https://docassemble.org/docs/logic.html#legal_logic)
--------------------------------------------------------------------------------------------------

**docassemble**’s “rules”-based logic system is particularly well-suited for legal applications. You can write legal logic in Python code, and **docassemble** will figure out how to ask the necessary questions to arrive at a legal judgment.

For example, suppose your interview needs to determine whether the user has legal standing as a grandparent to seek custody of a child. The relevant statute states that a grandparent can seek custody under the following circumstance:

```
(3) A grandparent of the child who is not in loco parentis to the child:

   (i) whose relationship with the child began either with the consent
       of a parent of the child or under a court order;

   (ii) who assumes or is willing to assume responsibility for the
        child; and

   (iii) when one of the following conditions is met:

      (A) the child has been determined to be a dependent child under
          42 Pa.C.S. Ch. 63 (relating to juvenile matters);

      (B) the child is substantially at risk due to parental abuse,
          neglect, drug or alcohol abuse or incapacity; or

      (C) the child has, for a period of at least 12 consecutive
          months, resided with the grandparent, excluding brief
          temporary absences of the child from the home, and is
          removed from the home by the parents, in which case the
          action must be filed within six months after the removal of
          the child from the home.
```

The interview developer can rewrite this statute in Python, converting each legal concept into a variable.

```
comment: 23 Pa. C.S.A. 5324(3)
code: |
  if relationship == 'Grandparent' \
     and (relationship_began_with_consent \
          or relationship_began_with_court_order) \
     and willing_to_assume_responsibility \
     and (child_is_dependent \
          or child_is_at_risk \
          or cared_for_child_for_a_year):
    has_grandparent_standing = True
  else:
    has_grandparent_standing = False
```

Note: if you are wondering why there are `\` marks at the end of some of the lines, this is Python syntax for formatting source code and avoiding writing a very long line of code. If the `\` was not present, there would be a syntax error, because Python would interpret the newline to mean that you were done specifying a condition, and it would think you forgot to write a `:` to indicate the end of the condition. The `\` basically means “ignore the following newline and pretend this is all one long line.”

The values of a variable like `relationship_began_with_consent` could be determined by asking the user a `question`.

```
question: |
  At some point, did one of the child's parents agree to let you care
  for the child?
yesno: relationship_began_with_consent
```

Other variables, like `cared_for_child_for_a_year`, might be too complex to reduce to a single question. In that case, rather than using a [`question`](https://docassemble.org/docs/questions.html#question) as the “rule” for what the variable means, you can use a [`code`](https://docassemble.org/docs/code.html) block instead, and you can break the legal concept down into smaller pieces.

```
code: |
  if (not child_lives_with_client) \
     and child_used_to_live_with_client \
     and child_taken_from_client_by_parent \
     and child_taken_within_last_six_months \
     and child_moved_in_at_least_12_months_before \
     and child_lived_with_client_continuously:
       cared_for_child_for_a_year = True
  else:
       cared_for_child_for_a_year = False
```

The rules for what these variables mean can in turn be specified as [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html) blocks:

```
question: |
  Does the child currently live with you?
yesno: child_lives_with_client
---
code: |
  if as_datetime(date_child_taken_away) >= date_as_of_six_months_ago:
    child_taken_within_last_six_months = True
  else:
    child_taken_within_last_six_months = False
```

Given [YAML](https://en.wikipedia.org/wiki/YAML) rules like this, **docassemble** can automatically conduct a parsimonious interview; that is, it will not ask any unnecessary questions. For example, if `willing_to_assume_responsibility` is `False`, it will not ask `child_is_dependent`. The only thing you need to do to trigger this process is to set up a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block that requires a definition of `has_grandparent_standing`.

```
mandatory: True
code: |
  if relationship == 'Grandparent' and not has_grandparent_standing:
    grandparent_not_eligible
  final_screen
---
event: grandparent_not_eligible
question: |
  Sorry, you do not have standing as a grandparent to seek custody
  under Pennsylvania law.
```

Many beginners find this style of rule-based logic specificiation to be confusing; they would rather specify exactly which questions are asked, and exactly what happens as a result of the answer to each question. However, when there are numerous legal rules and the interaction of the legal rules leads to a large number of possible scenarios, planning in advance the interview process for each one of these scenarios is time-consuming, and the work involved is mechanical rather than substantive. If you are going to offer users the ability to spot-edit any of their prior answers to questions in the middle of the interview, you will need to think about exactly which follow-up processes are necessary when the user makes such changes.

The “declarative” style of logic is very useful in these circumstances. All you need to do is the work of a lawyer – concentrate on specifying rules that are legally correct. You can specify multiple overlapping rules, covering special cases and general cases.

How rules determine interview process[¶](https://docassemble.org/docs/logic.html#interview_logic)
-------------------------------------------------------------------------------------------------

Many people envision a guided interview as a process whereby an interviewee starts at the beginning screen, then moves through a series of screens and then arrives at the end screen of the interview. At any point in time, the interviewee is envisioned as being located at a certain “place” in the interview process.

However, when the interview is driven by rules, this way of envisioning the interview process is misleading. For example, consider the following structure for an interview:

1.  Ask “What is your name?”
2.  Ask “When were you injured?”
3.  If the injury took place more than two years ago, say, “Sorry, the statute of limitations has expired, so you cannot file a complaint.”
4.  Ask “Where did the injury take place?”
5.  Ask “How much did you pay in medical bills?”
6.  Ask “How much time did you have to take off from work?”
7.  etc.
8.  Here is a complaint you can file in court.

Suppose the user started the interview one day before the statute of limitations expired, and proceeded as far as the “How much did you pay in medical bills?” question, but then took a few days to locate their medical bills, and didn’t complete the interview until a week after the statute of limitations expired. Should the guided interview allow the user to download a complaint, or should it tell the user, “Sorry, the statute of limitations has expired, so you cannot file a complaint.”? If you think of the interview process as one where the interviewee is “located” at a particular “place” in the interview, you would say that since the user has “gone past” the part of the interview process that checked for a statute of limitations problem, the user should be allowed to proceed.

The philosophy behind **docassemble** is that a robust interview process is one where the “current question” in the interview is determined not by which question “comes after” the previous question, but rather by the application of a set of rules to a set of facts. If there is a legal rule about the statute of limitations, it should be applied every time the screen loads, not just once at the beginning of the interview.

In **docassemble**, the interview logic is envisioned more as a “checklist” than a process. Each time the screen loads, **docassemble** reviews the checklist. What it does next depends on the application of the checklist to the current state of affairs.

By analogy, an airplane pilot will go through a checklist prior to takeoff. Whether the airline pilot turns onto the runway or goes back to the gate depends on the application of the checklist to the state of the aircraft and external factors like the weather. Likewise, what **docassemble** does when the screen loads depends on the application of the interview logic (specified in the [YAML](https://en.wikipedia.org/wiki/YAML)) to the current state of the interview answers and external factors like the date.

From the user’s perspective, the **docassemble** interview process looks like something that has a beginning, an end, and a “current location,” but this is really just the by-product of **docassemble** running through a checklist every time the screen loads. “Do we know the user’s name? Check. Has the statute of limitations expired? Check. Do we know where the injury took place? Check.”

If you observe an airplane pilot at work, you might think, “gosh, the pilot spends so much time going through boring repetitive checklists, can’t he just grab the controls and fly the plane?” Similarly, you might look at what **docassemble** does every time the screen loads, and you might think, “ugh, why is it wasting time going through all of this logic, can’t it just move on to the next question?” Although the checklist method is repetitive, it is robust and is capable of catching hard-to-foresee problems.

The **docassemble** interview developer’s job is to design the checklist that leads to the interview process, not to specify the process directly. In most situations, this is a distinction without a difference, because the developer can write something like this:

```
mandatory: True
code: |
  user.name.first
  favorite_fruit
  favorite_vegetable
  final_screen
```

This is a checklist for what should be considered every time the screen loads: “if the name is not known, ask the name. If the favorite fruit is not known, ask for the favorite fruit. If the favorite vegetable is not known, ask for the favorite vegetable. Then show the ‘final\_screen’ screen.” This translates directly into a process: “first ask for the name, then the favorite fruit, then the favorite vegetable, then show the final screen.”

In more complicated interviews, the connection between the checklist and the process is less explicit. For example:

```
mandatory: True
code: |
  user.name.first
  plaintiffs.gather()
  defendants.gather()
  if not jurisdiction_is_proper:
    kick_out_user
  final_screen
```

In this interview, after the user is asked for their name, **docassemble** gathers a list of plaintiffs and then gathers a list of defendants. The process of [gathering groups](https://docassemble.org/docs/groups.html) is complex and involves multiple `question` blocks. The line `plaintiffs.gather()` is effectively a checklist item that means “make sure the plaintiffs are gathered.” Groups can be gathered in a variety of ways. The questions might be “What is the name of the first plaintiff?”, “Are there any other plaintiffs?”, “What is the name of the second plaintiff?”, “Are there any other plaintiffs?”, etc. The line ```
if not
jurisdiction_is_proper
``` implicitly triggers the defining of `jurisdiction_is_proper`, which is defined by a [`code`](https://docassemble.org/docs/code.html) block.

By specifying a checklist, you can ensure the integrity of your interview’s logic, control the order of questions, and use to trigger the asking of questions that it would be too tedious to specify individually. There are things you need to think about, however, to ensure that your checklist results in a process that makes sense.

Beware of non-idempotency[¶](https://docassemble.org/docs/logic.html#idempotency)
---------------------------------------------------------------------------------

When designing the checklist that **docassemble** runs every time the screen loads, you need to be careful about how you specify the checklist items. For example, you wouldn’t want the checklist to be the following:

1.  Ask for the user’s name.
2.  Ask for the user’s date of birth.
3.  Give the user an assembled document.

That would mean that every time the screen loads, it would ask for the user’s name. Instead, the checklist should be:

1.  If the user’s name is unknown, ask them for it.
2.  If the user’s date of birth is unknown, ask them for it.
3.  Give the user an assembled document.

When you write a checklist in Python format, it looks like this:

```
mandatory: True
code: |
  user.name.first
  user.birthdate
  final_screen
```

In **docassemble**, referencing the name of a variable like `user.birthdate` effectively means “if `user.birthdate` is undefined, stop what we are doing and seek out a definition of `user.birthdate`; otherwise, proceed to the next line.”

By contrast, if you use the [`force_ask()`](https://docassemble.org/docs/functions.html#force_ask) function, it will always ask the question:

```
mandatory: True
code: |
  force_ask('user.name.first')
  force_ask('user.birthdate')
  final_screen
```

Here, the first “checklist” item says that **docassemble** must ask a question to determine the value of `user.name.first` even if the variable is already defined. This is not what you want to do in a checklist; the user will be confused about why the interview asks for their name again when they just provided it. (This is is one of the reasons why the [`force_ask()`](https://docassemble.org/docs/functions.html#force_ask) function is rarely used.)

**docassemble** allows you to run Python functions inside of a checklist, and in most situations this works as expected. For example:

```
mandatory: True
code: |
  user.name.first
  user.birthdate
  if not record_exists_in_database_for(user):
    error_screen
  final_screen
```

Here, there is a function called `record_exists_in_database_for()` that looks up the user based on the user’s name and birthdate. It is ok if this function runs every time the screen loads.

However, beginning developers sometimes assume that they can do this:

```
mandatory: True
code: |
  user.name.first
  user.email
  send_email(to=user, subject="Welcome", body="Welcome to the interview!")
  user.birthdate
  final_screen
```

This means that after the user provides their name and e-mail address, **docassemble** will send them an e-mail. However, it also means that every time the screen loads thereafter, **docassemble** will send another e-mail! The checklist item should have been written in such a way that the e-mail is only sent once:

```
mandatory: True
code: |
  user.name.first
  user.email
  if not task_performed('welcome_email'):
    send_email(to=user, subject="Welcome", body="Welcome to the interview!", task='welcome_email')
  user.birthdate
  final_screen
```

The [`task_performed()`](https://docassemble.org/docs/functions.html#task_performed) function, combined with the `task` paramater of the [`send_email()`](https://docassemble.org/docs/functions.html#send_email) function, is one way to ensure that code only runs once. Another method is to use a separate [`code`](https://docassemble.org/docs/code.html) block that defines a variable:

```
mandatory: True
code: |
  user.name.first
  user.email
  email_sent
  user.birthdate
  final_screen
---
code: |
  send_email(to=user, subject="Welcome", body="Welcome to the interview!")
  email_sent = True
```

The logic behind the `email_sent` line is: “if `email_sent` is not defined, run the code block in order to define it; otherwise continue to the next line.”

Another mistake that beginning developers sometimes make is writing a checklist that results in the user seeing a different screen if they refresh the screen without providing input. For example, consider this interview:

```
mandatory: True
code: |
  user.name.first
  user.email
  if not task_performed('data_stored'):
    store_data(user)
    mark_task_as_performed('data_stored')
    user.wants_email
    if user.wants_email:
      send_email(to=user, template=confirmation_email)
  user.birthdate
  final_screen
---
question: |
  Do you want a confirmation e-mail?
yesno: user.wants_email
```

In this example, after the user provides their e-mail address, **docassemble** will run the `store_data()` function, then it will mark the `data_stored` “task” as having been completed, and then it will see that `user.wants_email` is undefined, so it will ask the user if they would like to receive a confirmation e-mail. Suppose that the user, instead of answering the question, refreshes the screen. The interview logic will be evaluated again. Now, since the `data_stored` “task” has been marked as complete, the Python code skips the `if` clause and asks the user for `user.birthdate`. But this defeats the user’s expectation; the user reasonably expects that when they refresh the screen, they will see the `user.wants_email` question again. The problem is with the interview logic.

Software developers use the term “idempotent” to describe a system that produces the same result if an action is repeated. The interview logic in this circumstance is not idempotent because when it is repeated, a different result is produced.

Normally, your “checklist” should be designed to result in idempotent behavior. The exception would be if the passage of time has made the “current question” obsolete. For example, if the user started the interview before the statute of limitations period expired, and then tried to continue with the interview after the statute of limitations period expired, it would be reasonable for the user to see a different screen when they refreshed the screen.

Another consequence of non-idempotent logic is that users might see a pop-up message saying “Input not processed.” This is because of a security feature in **docassemble**: if the browser tries to submit input for a `question` that is different from what the current `question` is according to the interview logic, **docassemble** will reject the browser’s attempt to change the interview answers. In the example above, if the user clicked “Yes” or “No” in response to the question “Do you want a confirmation e-mail?”, the user would have seen an “Input not processed” error and been sent to the `user.birthdate` question.

To fix the idempotency problem, you could take the e-mail sending code out of the conditional statement:

```
mandatory: True
code: |
  user.name.first
  user.email
  if not task_performed('data_stored'):
    store_data(user)
    mark_task_as_performed('data_stored')
  user.wants_email
  if user.wants_email:
    send_email(to=user, template=confirmation_email)
  user.birthdate
  final_screen
```

Writing idempotent logic is also important because of the way that **docassemble** runs [`code`](https://docassemble.org/docs/code.html) blocks. Consider the following interview, which has a [`code`](https://docassemble.org/docs/code.html) block for calculating the user’s total income:

```
mandatory: True
question: |
  Tell me about your income and expenses.
fields:
  - Benefits income: benefits_income
    datatype: currency
  - Business income: business_income
    datatype: currency
  - Business expenses: business_expenses
    datatype: currency
---
mandatory: True
code: |
  total_income = 0.0
---
mandatory: True
code: |
  total_income = total_income + benefits_income
  total_income = total_income + net_business_income
---
code: |
  net_business_income = business_income - business_expenses
---
mandatory: True
question: |
  Your total income is ${ currency(total_income) }.
```

At first glance, this logic looks correct; the interview gathers information from the user, initializes `total_income` to zero, then adds the benefits income and the net business income to `total_income`. However, you will find that the calculation is incorrect; `benefits_income` will be counted twice.

The problem is that this [`code`](https://docassemble.org/docs/code.html) block is not idempotent:

```
mandatory: True
code: |
  total_income = total_income + benefits_income
  total_income = total_income + net_business_income
```

If this code runs more than once, the `total_income` will be increased each time. If you try to run this interview, this code block will run more than once. The first time it runs, it adds `benefits_income` to `total_income`, but then stops because `net_business_income` is undefined. **docassemble** obtains a definition of `net_business_income` in microseconds by running the [`code`](https://docassemble.org/docs/code.html) block that defines `net_business_income`. But after it does that, it does not resume where it left off (adding `net_business_income` to `total_income`). It will repeat the [`code`](https://docassemble.org/docs/code.html) block again, from the beginning. So `benefits_income` will be added to `total_income` a second time, and then `net_business_income` will be added, and then the “mandatory” block will be marked as having been completed, because it ran through all the way to the end.

If you are familiar with computer programming, **docassemble** works by trapping exceptions. When Python encounters an undefined variable, it raises an exception. **docassemble** traps that exception, figures out what variable was undefined, and then tries to define it. It does this either by asking the user a `question` or by running a ‘code’ block. Either way, the exception halts code execution, and Python is unable pick up exactly where it left off when the exception was raised.

The solution to this problem is to write the [`code`](https://docassemble.org/docs/code.html) block so that it can be run repeatedly without making a miscalculation:

```
mandatory: True
code: |
  total_income = 0
  total_income = total_income + benefits_income
  total_income = total_income + net_business_income
```

This way, the code will produce the correct total no matter how many undefined variables **docassemble** encounters along the way.

Inexperienced developers also sometimes make the error of assuming that all [`code`](https://docassemble.org/docs/code.html) blocks will run to completion. For example, suppose that the above interview was written like this, with only one `mandatory` block:

```
question: |
  Tell me about your income and expenses.
fields:
  - Benefits income: benefits_income
    datatype: currency
  - Business income: business_income
    datatype: currency
  - Business expenses: business_expenses
    datatype: currency
---
code: |
  total_income = 0.0
  total_income = total_income + benefits_income
  total_income = total_income + net_business_income
---
code: |
  net_business_income = business_income - business_expenses
---
mandatory: True
question: |
  Your total income is ${ currency(total_income) }.
```

This interview appears to be reasonable, but actually it contains a flaw. When **docassemble** tries to show the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question, it encounters an undefined variable `total_income`, so it seeks out a definition of `total_income`. It tries to run this [`code`](https://docassemble.org/docs/code.html) block:

```
code: |
  total_income = 0.0
  total_income = total_income + benefits_income
  total_income = total_income + net_business_income
```

**docassemble** sets `total_income` to zero, and then encounters an undefined variable, `benefits_income`, so it asks the `question` that defines `benefits_income`. However, what if the user refreshed the screen on the question that asks for the `benefits_income`? **docassemble** would attempt to show the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question again, and this time `total_income` is defined, so **docassemble** can display the screen, which says that the total income is zero. “But wait,” you say, “it didn’t finish running the [`code`](https://docassemble.org/docs/code.html) block that defines `total_income`!” True, but the rule of **docassemble**’s logic is that it goes through your [YAML](https://en.wikipedia.org/wiki/YAML), runs [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks that haven’t been run before, and tries to obtain definitions for any undefined variables that are encountered along the way. Nothing in this rule says that it will remember if it left a [`code`](https://docassemble.org/docs/code.html) block early and go back to it.

The moral of the story is that if you are going to use dependency satisfaction, do not allow your dependencies to be satisfied prematurely. The [`code`](https://docassemble.org/docs/code.html) block should be written instead as:

```
code: |
  total_income = benefits_income + net_business_income
```

or

```
code: |
  total_income = benefits_income + net_business_income
  draft_total_income = 0.0
  draft_total_income = total_income + benefits_income
  draft_total_income = total_income + net_business_income
  total_income = draft_total_income
  del draft_total_income
```

You can think of the undefined-ness of a variable as **docassemble**’s incentive to obtain the definition of the variable. It is like hiring a busy contractor to do work on your house; if you give the contractor his final payment after he is only halfway done with the job, he might leave at the end of the day and forget to come back later to finish the work.

You might be tempted to combine the definition of several variables in a single [`code`](https://docassemble.org/docs/code.html) block, perhaps because you think it saves space or is easier to read:

```
code: |
  subtotal = 0
  for item in asset:
    if item.countable:
      subtotal = subtotal + item.value
  total_assets = subtotal
  temp_list = []
  for item in income:
    if item.included and item.type not in income.items:
      temp_list.append(item.type)
  income_items = temp_list
```

Think about what will happen if the interview needs a value of `total_assets`. It will run the [`code`](https://docassemble.org/docs/code.html) block, and halfway through, the value of `total_assets` will be obtained. But the code will not stop executing; it will go on to start building the `income_items` list. This will work fine if the `income` list has been completely gathered, but what if it has not been? Then the [`code`](https://docassemble.org/docs/code.html) block may result in the asking of a question about the `income` list, but if the user refreshes the screen, that question will go away. This introduces an idempotency problem.

It is a much better practice to separate your code into single-purpose `code` blocks:

```
code: |
  subtotal = 0
  for item in asset:
    if item.countable:
      subtotal = subtotal + item.value
  total_assets = subtotal
---
code: |
  temp_list = []
  for item in income:
    if item.included and item.type not in income.items:
      temp_list.append(item.type)
  income_items = temp_list
```

This way, no matter whether your interview needs `total_assets` first or `income_items` first, and regardless of whether it has already gathered `income` or `asset`, these [`code`](https://docassemble.org/docs/code.html) blocks will perform their function and deliver a definition without causing any non-idempotent questions to be asked.

As a general rule, Let each [`code`](https://docassemble.org/docs/code.html) block serve a single purpose, or a set of closely-related purposes, and let it deliver its award (the defining of the variable sought) on the last line. If you get into this habit, you will avoid hard-to-debug logic errors.

Although typically your non-`mandatory` [`code`](https://docassemble.org/docs/code.html) blocks should only set one variable at a time, it is ok if they set other variables incidentally. However, in that situation you should probably use the [`only sets`](https://docassemble.org/docs/modifiers.html#only%20sets) modifier.

For example, suppose you have an interview in which you want to ask the user, “Do you receive income from public benefits?”, and you want to set the variable `has_benefits` to the answer, but as a double-check on the validity of the answer, you want to set `has_benefits` to `True` during the income gathering process if the user indicates that they have income from disability or welfare income.

```
question: |
  Do you receive income from public benefits?
yesno: has_benefits
---
code: |
  temp_total = []
  for item in income:
    if item.included and item.type not in income.items:
      temp_total.append(item.type)
    if item.type in ['disability', 'welfare']:
      has_benefits = True
  total_income = temp_total
```

The problem here is that the income gathering question will now be called upon to set `has_benefits`. If `has_benefits` is needed before `total_income`, the interview will start asking about income items, but will mysteriously stop in the middle of the process if the user enters a disability or welfare income item. Then, when `total_income` is needed later in the interview, it will resume asking questions about the income items. It would be better if you used `only sets`:

```
only sets: total_income
code: |
  temp_total = []
  for item in income:
    if item.included and item.type not in income.items:
      temp_total.append(item.type)
    if item.type in ['disability', 'welfare']:
      has_benefits = True
  total_income = temp_total
```

That way, the [`code`](https://docassemble.org/docs/code.html) block will only be called upon to define `total_income`. It can still have the side effect of setting `has_benefits` to `True`, but it will not be called upon to define anything other than `total_income`.

The logical order of an interview[¶](https://docassemble.org/docs/logic.html#order)
-----------------------------------------------------------------------------------

In the previous sections, we have explained that when **docassemble** runs your interview, it goes through your [YAML](https://en.wikipedia.org/wiki/YAML) looking for blocks that are [`mandatory`](https://docassemble.org/docs/logic.html#mandatory), and it tries to run them in order. When it encounters an undefined variable, it stops what it is doing and tries to obtain a definition of that undefined variable.

If a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`question`](https://docassemble.org/docs/questions.html#question) is answered, or a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html) block’s [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code runs all the way through to end, then **docassemble** remembers that the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block has been completed, and the next time it evaluates the interview logic, it will skip over the block.

(Technical note: how does **docassemble** remember that a block has been completed? It stores a variable in the interview answers, inside of a special dictionary called `_internal`. In order to identify the blocks that have been completed, it uses the block’s [`id`](https://docassemble.org/docs/modifiers.html#id). If you do not specify an [`id`](https://docassemble.org/docs/modifiers.html#id) on a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block, **docassemble** will generate an identifier like `Question_0` or `Question_1` for the first and second blocks in your [YAML](https://en.wikipedia.org/wiki/YAML) file. This means that if you have an interview that is “in production” and users have active sessions in that interview, and then you change the [YAML](https://en.wikipedia.org/wiki/YAML) to insert new blocks or move them around, you could cause these identifiers to change, and then users who started sessions before you changed the YAML could experience problems where questions they have already answered are re-asked. In order to avoid this problem, make sure to attach a unique [`id`](https://docassemble.org/docs/modifiers.html#id) to each [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block in your interview. That way, even if you rearrange the [YAML](https://en.wikipedia.org/wiki/YAML), users with existing sessions will not experience problems.)

In addition to [`mandatory`](https://docassemble.org/docs/logic.html#mandatory), there is a second type of modifier you can use to force a [`code`](https://docassemble.org/docs/code.html) block to be processed. If you mark a [`code`](https://docassemble.org/docs/code.html) block with `initial: True`, then the block will be run every time the screen loads, even if it has run before. The block is “initial” in the sense that it initializes the interview logic that will be evaluated during the screen load.

[`mandatory`](https://docassemble.org/docs/logic.html#mandatory) and [`initial`](https://docassemble.org/docs/logic.html#initial) blocks are evaluated in the order they appear in the question file. Therefore, the location in the interview of [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) and [`initial`](https://docassemble.org/docs/logic.html#initial) blocks, relative to each other, is important.

The order in which non-[`mandatory`](https://docassemble.org/docs/logic.html#mandatory) and non-[`initial`](https://docassemble.org/docs/logic.html#initial) questions appear is usually not important. If **docassemble** needs a definition of a variable, it will go looking for a block that defines the variable.

Consider the following example:

```
question: |
  Do you like penguins?
yesno: user_likes_penguins
---
question: |
  Do you like elephants?
yesno: user_likes_elephants
---
mandatory: true
question: |
  Hello!
buttons:
  - Hello to you: continue
---
mandatory: true
question: |
  What is your name?
fields:
  - Name: user_name
---
mandatory: true
question: |
  Your favorite food is
  ${ favorite_food }.

  % if user_likes_penguins:
  You are a fan of penguins.
  % else:
  You detest penguins, for some
  strange reason.
  % endif
---
question: |
  What is your favorite food?
fields:
  - Favorite food: favorite_food
```

[![Image 49: Screenshot of order-of-blocks example](https://docassemble.org/img/examples/order-of-blocks.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/order-of-blocks.yml&reset=1 "Click to try this interview")

The order of the questions is:

1.  Hello!
2.  What is your name?
3.  What is your favorite food?
4.  Do you like penguins?

The first two questions are asked because the corresponding [`question`](https://docassemble.org/docs/questions.html#question) blocks are marked as [`mandatory`](https://docassemble.org/docs/logic.html#mandatory). They are asked in the order in which they are asked because of the way the [`question`](https://docassemble.org/docs/questions.html#question) blocks are ordered in the [YAML](https://en.wikipedia.org/wiki/YAML) file.

The next two questions are asked implicitly. The third and final [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block makes reference to two variables: `favorite_food` and `user_likes_penguins`. Since the [`question`](https://docassemble.org/docs/questions.html#question)s that define these variables are not `mandatory`, they can appear anywhere in the [YAML](https://en.wikipedia.org/wiki/YAML) file, in any order you want. In this case, the `favorite_food` [`question`](https://docassemble.org/docs/questions.html#question) block is at the end of the [YAML](https://en.wikipedia.org/wiki/YAML) file, and the `user_likes_penguins` [`question`](https://docassemble.org/docs/questions.html#question) block is at the start of the [YAML](https://en.wikipedia.org/wiki/YAML) file.

The order in which these two questions are asked is determined by the order of the variables in the text of the final [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) question. Since `favorite_food` is referenced first, and `user_likes_penguins` is referenced afterwards, the user is asked about food and then asked about penguins.

Note that there is also an extraneous question in the interview that defines `user_likes_elephants`; the presence of this [`question`](https://docassemble.org/docs/questions.html#question) block in the [YAML](https://en.wikipedia.org/wiki/YAML) file has no effect on the interview.

Generally, you can order non-[`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks in your [YAML](https://en.wikipedia.org/wiki/YAML) file any way you want. You may want to group them by subject matter into separate [YAML](https://en.wikipedia.org/wiki/YAML) files that you [`include`](https://docassemble.org/docs/initial.html#include) in your main [YAML](https://en.wikipedia.org/wiki/YAML) file. When your interviews get complicated, there is no natural order to questions. In some situations, a question may be asked early, and in other situations, a question may be asked later.

Overriding one question with another[¶](https://docassemble.org/docs/logic.html#overriding)
-------------------------------------------------------------------------------------------

The order in which non-[`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks appear in the [YAML](https://en.wikipedia.org/wiki/YAML) file is only important if you have multiple blocks that each offer to define the same variable. In that case, the order of these blocks relative to each other is important. When looking for blocks that offer to define a variable, **docassemble** will use later-defined blocks first. Later blocks “supersede” the blocks that came before.

This allows you to [`include`](https://docassemble.org/docs/initial.html#include) “libraries” of questions in your interview while retaining the ability to customize how any particular question is asked.

As explained in the [initial blocks](https://docassemble.org/docs/initial.html) section, the effect of an [`include`](https://docassemble.org/docs/initial.html#include) block is basically equivalent to copying and pasting the contents of the included file into the original file.

For example, suppose that there is a [YAML](https://en.wikipedia.org/wiki/YAML) file called `question-library.yml`, which someone else wrote, which consists of the following questions:

```
question: |
  Nice evening, isn't it?
yesno: user_agrees_it_is_a_nice_evening
---
question: |
  Interested in going to the dance tonight?
yesno: user_wants_to_go_to_dance
```

You can write an interview that uses this question library:

```
include:
  - question-library.yml
---
mandatory: True
code: |
  if user_agrees_it_is_a_nice_evening and user_wants_to_go_to_dance:
    good_news
---
mandatory: True
question: |
  Say, I have to run.  Bye!
---
event: good_news
question: |
  That is splendid news!
```

[![Image 50: Screenshot of use-question-library example](https://docassemble.org/img/examples/use-question-library.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/use-question-library.yml&reset=1 "Click to try this interview")

When **docassemble** needs to know the definition of `user_agrees_it_is_a_nice_evening` or `user_wants_to_go_to_dance`, it will be able to find a block in `question-library.yml` that offers to define the variable.

Suppose, however, that you thought of a better way to ask the `user_wants_to_go_to_dance` question, but you don’t want to get rid of `question-library.yml` entirely. You could override the `user_wants_to_go_to_dance` question in `question-library.yml` by doing the following:

```
include:
  - question-library.yml
---
question: |
  So, about that dance tonight . . .
  wanna go?
yesno: user_wants_to_go_to_dance
---
mandatory: True
code: |
  if user_agrees_it_is_a_nice_evening and user_wants_to_go_to_dance:
    good_news
---
mandatory: True
question: |
  Say, I have to run.  Bye!
---
event: good_news
question: |
  That is splendid news!
```

[![Image 51: Screenshot of override example](https://docassemble.org/img/examples/override.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/override.yml&reset=1 "Click to try this interview")

This interview file loads the two questions defined in `question-library.yml`, but then, later in the list of questions, provides a different way to get the value of `user_wants_to_go_to_dance`. When **docassemble** goes looking for a question to provide a definition of `user_wants_to_go_to_dance`, it starts with the questions that were defined last, and it will prioritize your question over the question in `question-library.yml`. Your [`question`](https://docassemble.org/docs/questions.html#question) block takes priority because it is located _later_ in the [YAML](https://en.wikipedia.org/wiki/YAML) file.

This is similar to the way law works: old laws do not disappear from the law books, but they can get superseded by newer laws. “Current law” is simply “old law” that has not yet been superseded.

A big advantage of this feature is that you can include “libraries” written by other people without having to edit those other files in order to tweak them. You can use another person’s work without taking on the responsibility of maintaining that person’s work over time; you can just incorporate by reference that person’s file, which they continue to maintain.

For example, if someone else has developed interview questions that determine a user’s eligibility for food stamps, you can incorporate by reference that developer’s [YAML](https://en.wikipedia.org/wiki/YAML) file into an interview that assesses whether a user is maximizing his or her public benefits. When the law about food stamps changes, that developer will be responsible for updating his or her [YAML](https://en.wikipedia.org/wiki/YAML) file; your interview will not need to change. This allows for a division of labor. All you will need to do is make sure that the **docassemble** [package](https://docassemble.org/docs/packages.html) containing the food stamp [YAML](https://en.wikipedia.org/wiki/YAML) file gets updated on the server when the law changes.

Fallback questions[¶](https://docassemble.org/docs/logic.html#fallback)
-----------------------------------------------------------------------

If a [`code`](https://docassemble.org/docs/code.html) block does not, for whatever reason, actually define the variable, **docassemble** will “fall back” to a block that is located earlier in the [YAML](https://en.wikipedia.org/wiki/YAML) file. For example:

```
include:
  - question-library.yml
---
question: |
  I forgot, did we already agree to go to the dance together?
yesno: we_already_agreed_to_go
---
code: |
  if we_already_agreed_to_go:
    user_wants_to_go_to_dance = True
---
mandatory: True
code: |
  if user_agrees_it_is_a_nice_evening and user_wants_to_go_to_dance:
    good_news
---
mandatory: True
question: |
  Say, I have to run.  Bye!
---
event: good_news
question: |
  That is splendid news!
```

[![Image 52: Screenshot of fallback2 example](https://docassemble.org/img/examples/fallback2.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/fallback2.yml&reset=1 "Click to try this interview")

In this case, when **docassemble** tries to get a definition of `user_wants_to_go_to_dance`, it will first try running the [`code`](https://docassemble.org/docs/code.html) block, and then it will encounter `we_already_agreed_to_go` and seek its definition. If the value of `we_already_agreed_to_go` turns out to be false, the [`code`](https://docassemble.org/docs/code.html) block will run its course without setting a value for `user_wants_to_go_to_dance`. Not giving up, **docassemble** will keep going backwards through the blocks in the [YAML](https://en.wikipedia.org/wiki/YAML) file, looking for one that offers to define `user_wants_to_go_to_dance`. It will find such a question among the questions included by reference from `question_library.yml`, namely the question “Interested in going to the dance tonight?”

This “fall back” process can also happen with special [`question`](https://docassemble.org/docs/questions.html#question) blocks that use the [`continue`](https://docassemble.org/docs/questions.html#continue) option.

```
include:
  - question-library.yml
---
question: Which of these statements is true?
choices:
  - "I am old-fashioned":
      question: |
        My darling, would you do me the
        honor of accompanying me to
        the dance this fine evening?
      yesno: user_wants_to_go_to_dance
  - "I don't care for flowerly language": continue
---
mandatory: True
code: |
  if user_agrees_it_is_a_nice_evening and user_wants_to_go_to_dance:
    good_news
---
mandatory: True
question: |
  Say, I have to run.  Bye!
---
event: good_news
question: |
  That is splendid news!
```

[![Image 53: Screenshot of fallback example](https://docassemble.org/img/examples/fallback.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/fallback.yml&reset=1 "Click to try this interview")

In this case, the special [`continue`](https://docassemble.org/docs/questions.html#continue) choice causes **docassemble** to skip the [`question`](https://docassemble.org/docs/questions.html#question) block and look elsewhere for a definition of `user_wants_to_go_to_dance`. **docassemble** will “fall back” to the version of the question that exists within `question-library.yml`. When looking for a block that offers to define a variable, **docassemble** starts at the bottom and works its way up.

(Note that [`question`](https://docassemble.org/docs/questions.html#question)s using [`continue`](https://docassemble.org/docs/questions.html#continue) are of limited utility because they cannot use the [`generic object` modifier](https://docassemble.org/docs/fields.html#generic) or [index variables](https://docassemble.org/docs/fields.html#index%20variables). However, [`code`](https://docassemble.org/docs/code.html) blocks do not have this limitation.)

So, to recapitulate: when **docassemble** considers what blocks it _must_ process, it goes from top to bottom through your interview [YAML](https://en.wikipedia.org/wiki/YAML) file, looking for [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) and [`initial`](https://docassemble.org/docs/logic.html#initial) blocks; if a block is later in the file, it is processed later in time. However, when **docassemble** considers what question it should ask to define a particular variable, it goes from bottom to top; if a block is later in the file, it is considered to “supersede” blocks that are earlier in the file.

As explained [below](https://docassemble.org/docs/logic.html#precedence), however, instead of relying on relative placement of blocks in the [YAML](https://en.wikipedia.org/wiki/YAML) file, you can explicitly indicate which blocks take precedence over other blocks.

How **docassemble** runs your code[¶](https://docassemble.org/docs/logic.html#howitworks)
-----------------------------------------------------------------------------------------

**docassemble** goes through your interview [YAML](https://en.wikipedia.org/wiki/YAML) file from start to finish, incorporating [`include`](https://docassemble.org/docs/initial.html#include)d files as it goes. It always executes [`initial`](https://docassemble.org/docs/logic.html#initial) code when it sees it. It executes any [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html) blocks that have not been successfully executed yet. If it encounters a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`question`](https://docassemble.org/docs/questions.html#question) that it has not been successfully asked yet, it will stop and ask the question.

If at any time it encounters a variable that is undefined, for example while trying to formulate a question, it will interrupt itself in order to go find the a definition for that variable.

Whenever **docassemble** comes back from one of these excursions to find the definition of a variable, it does not pick up where it left off; it starts from the beginning again.

Therefore, when writing code for an interview, you need to keep in mind that any particular block of code may be re-run from the beginning multiple times.

For example, consider the following code:

```
---
mandatory: True
code: |
  if user_has_car:
    user_net_worth = user_net_worth + resale_value_of_user_car
    if user_car_brand == 'Toyota':
      user_is_sensible = True
    elif user_car_is_convertible:
      user_is_sensible = False
---
```

The intention of this code is to increase the user’s net worth by the resale value of the user’s car, if the user has a car. If the code only ran once, it would work as intended. However, because of **docassemble**’s design, which is to ask questions “as needed,” the code actually runs like this:

1.  **docassemble** starts running the code; it encounters `user_has_car`, which is undefined. It finds a question that defines `user_has_car` and asks it. (We will assume `user_has_car` is set to True.)
2.  **docassemble** runs the code again, and tries to increment the `user_net_worth` (which we can assume is already defined); it encounters `resale_value_of_user_car`, which is undefined. It finds a question that defines `resale_value_of_user_car` and asks it.
3.  **docassemble** runs the code again. The value of `user_net_worth` is increased. Then the code encounters `user_car_brand`, which is undefined. It finds a question that defines `user_car_brand` and asks it.
4.  **docassemble** runs the code again. The value of `user_net_worth` is increased (again). If `user_car_brand` is equal to “Toyota,” then `user_is_sensible` is set. In that case, the code runs successfully to the end, and the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) code block is marked as completed, so that it will not be run again.
5.  However, if `user_car_brand` is not equal to “Toyota,” the code will encounter `user_car_is_convertible`, which is undefined. **docassemble** will find a question that defines `user_car_is_convertible` and ask it. **docassemble** will then run the code again, the value of `user_net_worth` will increase yet again, and then (finally) the code will run successfully to the end.

The solution here is to make sure that your code is prepared to be stopped and restarted. For example, you could have a separate code block to compute `user_net_worth`:

```
---
mandatory: True
code: |
  user_net_worth = 0
  if user_has_car:
    user_net_worth = user_net_worth + resale_value_of_user_car
  if user_has_house:
    user_net_worth = user_net_worth + resale_value_of_user_house
---
```

Note that [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) must be true for this to work sensibly. If this were an optional code block, it would not run to completion because `user_net_worth` would already be defined when **docassemble** came back from asking whether the user has a car.

How **docassemble** finds questions for variables[¶](https://docassemble.org/docs/logic.html#variablesearching)
---------------------------------------------------------------------------------------------------------------

There can be multiple questions or code blocks in an interview that can define a given variable. You can write [`generic object`](https://docassemble.org/docs/modifiers.html#generic%20object) questions in order to define attributes of objects, and you can use [index variables](https://docassemble.org/docs/fields.html#index%20variables) to refer to any given item in a [`DAList`](https://docassemble.org/docs/objects.html#DAList) or [`DADict`](https://docassemble.org/docs/objects.html#DADict) (or a subtype of these objects). Which one will be used?

In general, if you have multiple questions or code blocks that are capable of defining a variable, **docassemble** will try the more specific ones first, and then the more general ones.

For example, if the interview needs a definition of `fruit['a'].seed_info.tally['b'].molecules[4].name`, it will look for questions that offer to define the following variables, in this order:

```
fruit['a'].seed_info.tally['b'].molecules[4].name
fruit[i].seed_info.tally['b'].molecules[4].name
fruit['a'].seed_info.tally[i].molecules[4].name
fruit['a'].seed_info.tally['b'].molecules[i].name
fruit[i].seed_info.tally[j].molecules[4].name
fruit[i].seed_info.tally['b'].molecules[j].name
fruit['a'].seed_info.tally[i].molecules[j].name
fruit[i].seed_info.tally[j].molecules[k].name
```

Then it will look for [`generic object`](https://docassemble.org/docs/modifiers.html#generic%20object) blocks that offer to define the following variables, in this order:

```
x['a'].seed_info.tally['b'].molecules[4].name
x[i].seed_info.tally['b'].molecules[4].name
x['a'].seed_info.tally[i].molecules[4].name
x['a'].seed_info.tally['b'].molecules[i].name
x[i].seed_info.tally[j].molecules[4].name
x[i].seed_info.tally['b'].molecules[j].name
x['a'].seed_info.tally[i].molecules[j].name
x[i].seed_info.tally[j].molecules[k].name
x.seed_info.tally['b'].molecules[4].name
x.seed_info.tally[i].molecules[4].name
x.seed_info.tally['b'].molecules[i].name
x.seed_info.tally[i].molecules[j].name
x.tally['b'].molecules[4].name
x.tally[i].molecules[4].name
x.tally['b'].molecules[i].name
x.tally[i].molecules[j].name
x['b'].molecules[4].name
x[i].molecules[4].name
x['b'].molecules[i].name
x[i].molecules[j].name
x.molecules[4].name
x.molecules[i].name
x[4].name
x[i].name
x.name
```

Moreover, when **docassemble** searches for a [`generic object`](https://docassemble.org/docs/modifiers.html#generic%20object) question for a given variable, it first look for [`generic object`](https://docassemble.org/docs/modifiers.html#generic%20object) questions with the object type of `x` (e.g., [`Individual`](https://docassemble.org/docs/objects.html#Individual)). Then it will look for [`generic object`](https://docassemble.org/docs/modifiers.html#generic%20object) questions with the parent type of object type of `x` (e.g., [`Person`](https://docassemble.org/docs/objects.html#Person)). It will keep going through the ancestors, stopping at the most general object type, [`DAObject`](https://docassemble.org/docs/objects.html#DAObject).

Note that the order of questions or code blocks in the [YAML](https://en.wikipedia.org/wiki/YAML) matters where the variable name is the same; the blocks that appear later in the [YAML](https://en.wikipedia.org/wiki/YAML) will be tried first. But when the variable name is different, the order of the blocks in the [YAML](https://en.wikipedia.org/wiki/YAML) does not matter. If your interview has a question that offers to define `seeds['apple']` and another question that offers to define `seeds[i]`, the `seeds['apple']` question will be tried first, regardless of where the question is located in the the [YAML](https://en.wikipedia.org/wiki/YAML).

Here is an example in which a relatively specific question, which sets `veggies[i][1]`, will be used instead of a more general question, which sets `veggies[i][j]`, when applicable:

```
question: |
  How much does the other
  ${ i } weigh?
fields:
  - Grams: veggies[i][1]
    datatype: number
---
question: |
  How much does the
  ${ ordinal(j) }
  ${ i } weigh?
fields:
  - Grams: veggies[i][j]
    datatype: number
```

[![Image 54: Screenshot of nested-veggies-override example](https://docassemble.org/img/examples/nested-veggies-override.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/nested-veggies-override.yml&reset=1 "Click to try this interview")

These rules about which blocks are tried before other blocks can be overriden using the [`order` initial block](https://docassemble.org/docs/initial.html#order) or the [`id` and `supersedes`](https://docassemble.org/docs/modifiers.html#precedence) modifiers. You can use the [`if` modifier](https://docassemble.org/docs/modifiers.html#if) to indicate that a given [`question`](https://docassemble.org/docs/questions.html#question) should only be asked under certain conditions. You can use the [`scan for variables` modifier](https://docassemble.org/docs/modifiers.html#scan%20for%20variables) to indicate that a [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html) block should only be considered when looking to define a particular variable or set of variables, even though it is capable of defining other variables.

Specifiers that control interview logic[¶](https://docassemble.org/docs/logic.html#specifiers)
----------------------------------------------------------------------------------------------

`mandatory`[¶](https://docassemble.org/docs/logic.html#mandatory)
-----------------------------------------------------------------

By default, all blocks in an interview are optional; they will be called upon only if needed to retrieve the value of a variable. However, if all blocks are optional, the interview has nothing to do. You can use the [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) modifier to indicate that a block must be run. The first [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block in your interview will be the starting point of the interview logic when the user first starts the interview.

Consider the following as a complete interview file:

```
---
question: What is the capital of Maine?
fields:
  - Capital: maine_capital
---
question: Are you sitting down?
yesno: user_sitting_down
mandatory: True
---
question: Your socks do not match.
mandatory: True
---
```

The interview will ask “Are you sitting down” and then it will say “Your socks do not match.” It will not ask “What is the capital of Maine?”

Another way to control the logic of an interview is to have a single, simple [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html) block that sets the interview in motion.

For example:

```
---
mandatory: True
code: |
  if user_sitting_down:
    user_informed_that_socks_do_not_match
  else:
    user_will_not_sit_down
---
question: What is the capital of Maine?
fields:
  - Capital: maine_capital
---
question: Are you sitting down?
yesno: user_sitting_down
---
question: Your socks do not match.
sets: user_informed_that_socks_do_not_match
---
question: You really should have sat down.
subquestion: I had something important to tell you.
sets: user_will_not_sit_down
---
```

Here, the single [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block contains simple [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code that contains the entire logic of the interview.

If a [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) specifier is not present within a block, it is as though [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) was set to `False`.

The value of [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) can be a [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) expression. If it is a [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) expression, the [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html) block will be treated as mandatory if the expression evaluates to a true value.

```
mandatory: |
  favorite_food == "apples"
question: |
  You have good taste in food.
buttons:
  - Continue: continue
---
mandatory: True
question: |
  Thank you for your input.
---
question: |
  What is your favorite food?
fields:
  - no label: favorite_food
```

[![Image 55: Screenshot of mandatory-code example](https://docassemble.org/img/examples/mandatory-code.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/mandatory-code.yml&reset=1 "Click to try this interview")

It is a best practice to tag all [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks with an [`id`](https://docassemble.org/docs/modifiers.html#id).

`initial`[¶](https://docassemble.org/docs/logic.html#initial)
-------------------------------------------------------------

The `initial` modifier causes the [`code`](https://docassemble.org/docs/code.html) block to be run every time **docassemble** processes your interview (i.e., every time the screen loads during an interview). [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks, by contrast, are never run again during the session if they are successfully “asked” once. **docassemble** executes the code in an [`initial`](https://docassemble.org/docs/logic.html#initial) block in the same way it executes the code of [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks, except that running to completion does not mean the block will not be executed again.

`initial` blocks should be used in the following situations:

*   “Initializing” the Python context in a [multi-user interview](https://docassemble.org/docs/roles.html) depending on who the user is. For example, if your interview uses a variable `user` that should always refer to an [`Individual`](https://docassemble.org/docs/objects.html#Individual) object corresponding to the user, you can write an `initial` block that looks at `user_info().email` to figure out who the logged-in user is.
*   When you are using the [actions](https://docassemble.org/docs/functions.html#actions) feature and you want to make sure the [actions](https://docassemble.org/docs/functions.html#actions) are processed only in particular circumstances.

Here is an example that illustrates how `initial` blocks work:

```
mandatory: True
code: |
  counter = 0
---
initial: True
code: |
  counter = counter + 1
---
question: |
  How many peaches do you have?
subquestion: |
  The value of the counter
  is ${ counter }.
fields:
  - no label: peaches
    datatype: integer
---
code: |
  fruits = peaches + pears
---
question: |
  How many pears do you have?
subquestion: |
  The value of the counter
  is ${ counter }.
fields:
  - no label: pears
    datatype: integer
---
question: |
  You have ${ fruits } pieces of fruit.
subquestion: |
  The value of the counter
  is ${ counter }.
mandatory: True
```

[![Image 56: Screenshot of initial example](https://docassemble.org/img/examples/initial.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/initial.yml&reset=1 "Click to try this interview")

Note in this example that from screen to screen, the `counter` increments from 1 to 3 and then to 6. The counter does not count the number of screens displayed, but rather the number of times the interview logic was evaluated. The number of times the interview logic gets evaluated is hard to predict, but you can count on it being evaluated many times, so you need to make sure you write your logic in an [idempotent](https://docassemble.org/docs/logic.html#idempotency) manner.

On every screen load, the interview logic is evaluated prior to processing the input in order to ensure that the input is responding to whatever the current `question` is. **docassemble** needs to evaluate the interview logic in order to know what the current `question` is. It is then evaluated after the input is processed, so that the user can be presented with the next `question`. In addition, the interview logic will be re-evaluated when an undefined variable is encountered and a `code` block provides the value of a variable.

1.  The interview logic is evaluated, but the evaluation stops when the undefined variable `fruit` is encountered. The interview then tries to run the [`code`](https://docassemble.org/docs/code.html) block to get `fruit`, but encounters an undefined variable `peaches`, so it asks a question to gather `peaches`.
2.  The interview logic is evaluated, but the evaluation stops when the undefined variable `fruit` is encountered. The interview then tries to run the [`code`](https://docassemble.org/docs/code.html) block to get `fruit`, but encounters an undefined variable `pears`, so it asks a question to gather `pears`.
3.  The interview logic is evaluated, but the evaluation stops when the undefined variable `fruit` is encountered. The interview then runs the [`code`](https://docassemble.org/docs/code.html) block, and this time, `fruit` is successfully defined.
4.  The interview logic is evaluated again, and the final question is displayed.

Like [`mandatory`](https://docassemble.org/docs/logic.html#mandatory), `initial` can be set to `True`, `False`, or to [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) code that will be evaluated to see whether it evaluates to a true or false value.

If your interview has a single [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) code block and it is incapable of running to completion, then you don’t really need an `initial` block because you can put the logic that needs to run every time the screen loads at the beginning of that [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) block.

`need`[¶](https://docassemble.org/docs/logic.html#need)
-------------------------------------------------------

The `need` specifier allows you to manually specify the prerequisites of a [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html) block. This can be helpful for tweaking the order in which questions are asked.

```
mandatory: True
need:
  - number_of_years_old
  - favorite_animal
question: |
  Thank you for that information.
subquestion: |
  My favorite animal is
  ${ favorite_animal },
  too!

  % if number_of_years_old < 10:
  You're growing so fast.  Pretty
  soon you'll be driving a
  ${ favorite_color } car!
  % endif
```

[![Image 57: Screenshot of need-specifier example](https://docassemble.org/img/examples/need-specifier.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/need-specifier.yml&reset=1 "Click to try this interview")

In this example, the ordinary course of the interview logic would ask “What is your favorite animal?” as the first question. However, everyone knows that the first question you should ask of a child is “How old are you?” The `need` specifier indicates that before **docassemble** should even try to present the “Thank you for that information” screen, it should ensure that `number_of_years_old` old is defined, then ensure that `favorite_animal`, and then try to present the screen.

The variables listed in a `need` specifier do not have to actually be used by the question. Also, if your question uses variables that are not mentioned in the `need` list, **docassemble** will still pursue definitions of those variables.

If any of the variables listed under `need` are undefined, **docassemble** will obtain their definitions before processing the content of the [`question`](https://docassemble.org/docs/questions.html#question). For example, suppose you have the following [`question`](https://docassemble.org/docs/questions.html#question):

```
need:
  - favorite_fruit
question: |
  Your favorite apple is ${ favorite_apple }.
continue button field: fruit_verified
```

If both `favorite_fruit` and `favorite_apple` are undefined, the definition of `favorite_fruit` will be sought first.

What if you wanted `favorite_fruit` to be sought **after** `favorite_apple`? To do this, you can use the following special form of `need`:

```
need:
  post:
    - favorite_fruit
question: |
  Your favorite apple is ${ favorite_apple }.
continue button field: fruit_verified
```

In this case, the definition of `favorite_fruit` will be sought after all of the prerequisites of the `question` have been satisfied.

You can organize your `need` items into `pre` and `post` items:

```
need:
  pre:
    - favorite_vegetable
  post:
    - favorite_fruit
```

You can also include `post` among a list of other items:

```
need:
  - favorite_vegetable
  - post:
      - favorite_fruit
```

`depends on`[¶](https://docassemble.org/docs/logic.html#dependson)
------------------------------------------------------------------

The `depends on` specifier indicates that if the listed variables change, the results of the [`question`](https://docassemble.org/docs/questions.html#question) or [`code`](https://docassemble.org/docs/code.html) block should be invalidated.

```
question: |
  What is A?
fields:
  - A: a
    datatype: number
---
question: |
  What is the square of ${ a }?
fields:
  - B: b
    datatype: number
depends on:
  - a
---
code: |
  c = a + b
depends on:
  - a
  - b
---
event: review_screen
skip undefined: False
question: |
  Review your answers.
review:
  - label: Edit A
    field: a
    button: |
      A is ${ a }.
  - label: Edit B
    field: b
    button: |
      B is ${ b }.
  - note: |
      C is ${ c }.
---
mandatory: True
code: |
  need(a, b, c)
  review_screen
```

[![Image 58: Screenshot of depends-on example](https://docassemble.org/img/examples/depends-on.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/depends-on.yml&reset=1 "Click to try this interview")

In this example, if the user goes through the interview to the end, but then edits `a`, then if and when `a` is changed to a different value, `c` and `b` will be undefined. The original value of `b` will be remembered, so that when the interview logic asks the question to define `b`, the original value will be presented as a default. When `a` is set, `c` is also undefined, so that when the interview logic requires a definition of `c`, the [`code`](https://docassemble.org/docs/code.html) block will be run to recompute the value of `c`.

If the user goes through the interview and then edits `b`, a change in `b` will trigger the invalidation of `c`.

The `depends on` specifier will also cause variables to be invalidated when they are changed by a [`code`](https://docassemble.org/docs/code.html) block.

```
question: |
  What is A?
fields:
  - A: a
    datatype: number
---
code: |
  b = a * a
depends on:
  - a
---
code: |
  c = a + b
depends on:
  - a
  - b
---
event: review_screen
skip undefined: False
question: |
  Review your answers.
review:
  - label: Edit A
    field: a
    button: |
      A is ${ a }.
  - note: |
      B is ${ b }.
  - note: |
      C is ${ c }.
---
mandatory: True
code: |
  need(a, b, c)
  review_screen
```

[![Image 59: Screenshot of depends-on-code example](https://docassemble.org/img/examples/depends-on-code.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/depends-on-code.yml&reset=1 "Click to try this interview")

In this interview, the variable `b` is set by a [`code`](https://docassemble.org/docs/code.html) block. If the user edits `a` to a different value, the `depends on` specifier on the [`code`](https://docassemble.org/docs/code.html) block causes the [`code`](https://docassemble.org/docs/code.html) block to be re-run. The change in `b` causes the value of `c` to be invalidated. As a result, `c` is automatically updated when `a` changes.

Note that the `depends on` specifier results in invalidation when a variable is changed, not when it is defined. If a variable is undefined and is then defined, this is not considered a change for purposes of the `depends on` specifier. If a user presses Continue on a screen but does not change the value of a variable, the `depends on` logic is not triggered.

The `depends on` specifier can be used with iterator variables.

```
objects:
  - people: DAList.using(object_type=Individual, there_are_any=True, complete_attribute='complete')
---
question: |
  How much does ${ people[i] }
  get paid per pay period?
fields:
  - Amount: people[i].income
    datatype: currency
depends on:
  - people[i].pay_period
---
question: |
  How frequently does
  ${ people[i] } get paid?
fields:
  - no label: people[i].pay_period
    datatype: number
    choices:
      - Monthly: 12.0
      - Biweekly: 26.0
      - Semi-monthly: 24.0
      - Weekly: 52.0
---
code: |
  people[i].annual_income = people[i].income * people[i].pay_period
depends on:
  - people[i].pay_period
  - people[i].income
---
question: |
  What is the name of the
  ${ ordinal(i) } person?
fields:
  - First name: people[i].name.first
  - Last name: people[i].name.last
---
code: |
  people[i].name.first
  people[i].annual_income
  people[i].complete = True
---
question: |
  Is there another person?
yesno: people.there_is_another
---
field: review_screen
question: Review
subquestion: |
  ${ people.table }

  ${ people.add_action() }
---
table: people.table
rows: people
columns:
  - Name: row_item.name
  - Annual income: currency(row_item.annual_income)
edit:
  - name.first
  - pay_period
---
event: final_screen
question: Summary
subquestion: |
  % for person in people:
  ${ person }
  makes
  ${ currency(person.income) }
  ${ nice_number(person.pay_period) }
  times per year, for an annual income of
  ${ currency(person.annual_income) }.

  % endfor

  [Review](${ url_action('review_screen') })
---
mandatory: True
code: |
  people.gather()
  people.table
  final_screen
```

[![Image 60: Screenshot of depends-on-iterator example](https://docassemble.org/img/examples/depends-on-iterator.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/depends-on-iterator.yml&reset=1 "Click to try this interview")

In this interview, the “Edit” button on the table only triggers the asking of the `.pay_period` question, but the `depends on` logic will cause the `.income` question to be re-asked, and the `.annual_income` amount to be re-calculated, if the `.pay_period` answer changes.

In situations where variables that are part of a list need to be invalidated when a variable that is not part of the same list item changes, the [`on change`](https://docassemble.org/docs/initial.html#on%20change) block can be used.

`reconsider`[¶](https://docassemble.org/docs/logic.html#reconsider)
-------------------------------------------------------------------

The `reconsider` modifier can be used in two ways: it can be set to a list of variables, or it can be set to `True`.

### Effect when set to a list of variable names

When you set `reconsider` to a list of variable names, then before the `question` is asked, the variables will be undefined (if they are defined at all), and then the definition of each variable will be sought again.

```
reconsider:
  - minutes_since_world_series
question: |
  It has been ${ minutes_since_world_series } minutes since
  your team won the world series.  Have you gotten over
  your excitement yet?
yesno: gotten_over_excitement
```

This can be useful when your [`question`](https://docassemble.org/docs/questions.html#question) refers to a computed variable that might have become out-of-date since the last time it was computed.

### Effect when set to `True`

If `reconsider` is set to `True` on a [`code`](https://docassemble.org/docs/code.html) block, then **docassemble** will always “reconsider” the values of any of the variables set by the block. That is, every time the interview is assembled (every time the screen loads) **docassemble** will forget about the value of any of the variables set by the [`code`](https://docassemble.org/docs/code.html) block.

You will want to set `reconsider` to `True` if your interview flow is such that you want **docassemble** to reconsider its definition of a variable based on information that might be gathered in the future.

For example, see if you can find the problem with the interview below.

```
---
code: |
  cat_food_cans_needed = number_of_cats * 4
---
question: |
  Does your neighbor's cat sometimes eat at your house?
subquestion: |
  To feed your own cat, you will need ${ cat_food_cans_needed } cans
  of cat food, but you might need more for your neighbor's cat.
buttons:
  - "Yes":
      code: |
        number_of_cats = number_of_cats + 1
        has_neighboring_cat = True
  - "No":
      code: |
        has_neighboring_cat = False
---
question: How many cats do you have?
fields:
  - Cats: number_of_cats
    datatype: integer
---
question: |
  To feed your cat
  % if has_neighboring_cat:
  and your neighbor's cat
  % endif
  you will need to buy ${ cat_food_cans_needed } cans of cat food.
sets: all_done
---
mandatory: True
code: all_done
```

The problem with this interview is that it will compute the number of cans of cat food needed when it says “To feed your own cat, you will need . . . cans of cat food,” but it will not increase the number of cans of cat food to account for later-acquired information (i.e. the fact that the neighbor’s cat comes over). Once `cat_food_cans_needed` has been defined once, **docassemble** will continue to use that definition whenever the interview calls for the definition of `cat_food_cans_needed`.

This problem can be fixed by adding `reconsider: True` to the [`code`](https://docassemble.org/docs/code.html) block:

```
---
code: |
  cat_food_cans_needed = number_of_cats * 4
reconsider: True
---
```

The `reconsider` modifier tells **docassemble** to always reconsider the variables in the [`code`](https://docassemble.org/docs/code.html) block. When the final screen comes up, **docassemble** will have forgotten about the earlier-defined value of `cat_food_cans_needed` and will therefore re-define the value by re-running the [`code`](https://docassemble.org/docs/code.html) block.

```
code: |
  cat_food_cans_needed = number_of_cats * 4
reconsider: True
```

[![Image 61: Screenshot of reconsider example](https://docassemble.org/img/examples/reconsider.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/reconsider.yml&reset=1 "Click to try this interview")

The `reconsider` modifier is particularly important to use when you allow interviewees to go back and modify past answers using a [`review`](https://docassemble.org/docs/fields.html#review) block. For more information about how to implement such features, see [`review`](https://docassemble.org/docs/fields.html#review), [`event`](https://docassemble.org/docs/fields.html#event), [`url_action()`](https://docassemble.org/docs/functions.html#url_action), [`process_action()`](https://docassemble.org/docs/functions.html#process_action), [`action_menu_item()`](https://docassemble.org/docs/functions.html#action_menu_item), and [`menu_items`](https://docassemble.org/docs/special.html#menu_items).

**docassemble** also offers the [`reset` initial block](https://docassemble.org/docs/initial.html#reset), which has the same effect as the `reconsider` modifier, but using a different way of specifying which variables should be reconsidered. Whether you use the [`reset` initial block](https://docassemble.org/docs/initial.html#reset) or the `reconsider` modifier is a question of what you consider to be more convenient and/or readable.

`undefine`[¶](https://docassemble.org/docs/logic.html#undefine)
---------------------------------------------------------------

When you set `undefine` to a list of variable names, then before the `question` is asked, the variables will be undefined.

```
undefine:
  - favorite_foods
question: |
  What is your favorite fruit?
fields:
  - Favorite fruit: favorite_fruit
---
code: |
  favorite_foods = [favorite_vegetable, favorite_fruit]
---
mandatory: True
question: |
  Your favorite foods are
  ${ comma_and_list(favorite_foods) }.
```

This can be useful when you allow users to change their answers using review screens. Sometimes a change to one variable will invalidate answers to other [`question`](https://docassemble.org/docs/questions.html#question)s, or to computations made by [`code`](https://docassemble.org/docs/code.html) blocks.

Combining multiple interviews into one[¶](https://docassemble.org/docs/logic.html#multipleinterviews)
-----------------------------------------------------------------------------------------------------

Using an umbrella YAML file[¶](https://docassemble.org/docs/logic.html#multipleinterviewsumbrella)
--------------------------------------------------------------------------------------------------

If you have multiple interviews and you want the user to choose which interview to run, you could offer the multiple interviews as a single interview, where there is an “umbrella” [YAML](https://en.wikipedia.org/wiki/YAML) file that [`include`](https://docassemble.org/docs/initial.html#include)s the others.

For example:

```
include:
  - interview-fruit.yml
  - interview-vegetables.yml
  - interview-flowers.yml
---
question: |
  What interview would you like to do?
field: interview_choice
choices:
  - Fruit
  - Vegetables
  - Flowers
---
mandatory: true
code: |
  if interview_choice == 'Fruit':
    interview_fruit_done
  elif interview_choice == 'Vegetables':
    interview_vegetables_done
  elif interview_choice == 'Flowers':
    interview_flowers_done
```

[![Image 62: Screenshot of umbrella-interview example](https://docassemble.org/img/examples/umbrella-interview.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/umbrella-interview.yml&reset=1 "Click to try this interview")

Note that this interview [`include`](https://docassemble.org/docs/initial.html#include)s three separate [YAML](https://en.wikipedia.org/wiki/YAML) files. The controlling logic is the [`code`](https://docassemble.org/docs/code.html) block in the “umbrella” interview that pursues a different endpoint depending on the value of `interview_choice`.

The three interview files included are:

*   [interview-fruit.yml](https://github.com/jhpyle/docassemble/blob/master/docassemble_base/docassemble/base/data/questions/examples/interview-fruit.yml)
*   [interview-vegetables.yml](https://github.com/jhpyle/docassemble/blob/master/docassemble_base/docassemble/base/data/questions/examples/interview-vegetables.yml)
*   [interview-flowers.yml](https://github.com/jhpyle/docassemble/blob/master/docassemble_base/docassemble/base/data/questions/examples/interview-flowers.yml)

Note that these interview files contain everything needed for the interview except for any [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) blocks that would define an interview endpoint; that function is reserved for the “umbrella” interview.

Using hyperlinks[¶](https://docassemble.org/docs/logic.html#multipleinterviewslinks)
------------------------------------------------------------------------------------

There are other ways to offer users a choice of interviews. For example, you can use the [`interview_url()`](https://docassemble.org/docs/functions.html#interview_url) function with the `i` optional keyword parameter to point users from one interview to another:

```
mandatory: true
question: |
  What interview would you
  like to use?
subquestion: |
  * [Fruit]
  * [Vegetables]
  * [Flowers]

  [Fruit]: ${ interview_url(i='docassemble.demo:data/questions/interview-about-fruit.yml') }
  [Vegetables]: ${ interview_url(i='docassemble.demo:data/questions/interview-about-vegetables.yml') }
  [Flowers]: ${ interview_url(i='docassemble.demo:data/questions/interview-about-flowers.yml') }
```

[![Image 63: Screenshot of interview-url-refer example](https://docassemble.org/img/examples/interview-url-refer.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/interview-url-refer.yml&reset=1 "Click to try this interview")

You might also offer these hyperlinks in the menu, using the [`menu_items`](https://docassemble.org/docs/special.html#menu_items) special variable:

```
mandatory: True
code: |
  menu_items = [ {'url': interview_url(i='docassemble.demo:data/questions/interview-about-fruit.yml'),
                  'label': 'Fruit'},
                 {'url': interview_url(i='docassemble.demo:data/questions/interview-about-vegetables.yml'),
                  'label': 'Vegetables'}, 
                 {'url': interview_url(i='docassemble.demo:data/questions/interview-about-flowers.yml'),
                  'label': 'Flowers'} ]
---
mandatory: True
question: |
  Select an option from the
  menu in the upper right.
```

[![Image 64: Screenshot of menu-items-refer example](https://docassemble.org/img/examples/menu-items-refer.png)](https://demo.docassemble.org/interview?i=docassemble.base:data/questions/examples/menu-items-refer.yml&reset=1 "Click to try this interview")

You can also use the [`dispatch`](https://docassemble.org/docs/config.html#dispatch) configuration directive in combination with [`show dispatch link`](https://docassemble.org/docs/config.html#show%20dispatch%20link) to allow the user to access a list of interviews available on your server by selecting “Available Interviews” from the menu.

A/B testing with redirects[¶](https://docassemble.org/docs/logic.html#multipleinterviewsredirect)
-------------------------------------------------------------------------------------------------

The hyperlinks described in the previous subsection can also be used with the [`command()`](https://docassemble.org/docs/functions.html#command) function to automatically redirect the user to a particular interview, for example for the purposes of A/B testing.

The following interview seamlessly redirects the user to either the [demo interview](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/questions.yml) or the [example interview for the `redact()` function](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/redact-docx.yml), depending on a computational coin flip.

```
mandatory: true
code: |
  import random
  if random.random() < 0.5:
    url = interview_url(i="docassemble.demo:data/questions/questions.yml")
  else:
    url = interview_url(i="docassemble.demo:data/questions/examples/redact-docx.yml")
  command('exit', url=url)
```

[![Image 65: Screenshot of ab-test example](https://docassemble.org/img/examples/ab-test.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/ab-test.yml&reset=1 "Click to try this interview")

The use of `'exit'` in the [`command()`](https://docassemble.org/docs/functions.html#command) function is important here because it will cause this brief interview session to be deleted from the user’s list of interview sessions, since its sole purpose is to redirect the user.

An interview like this might also log some data for purposes of collecting metrics, perhaps using [Redis](https://docassemble.org/docs/functions.html#redis). In the interviews being A/B tested, metrics could be logged using [Redis](https://docassemble.org/docs/functions.html#redis) or the [Google Analytics feature](https://docassemble.org/docs/config.html#google%20analytics).

Using multiple endpoints in a single interview[¶](https://docassemble.org/docs/logic.html#subinterview)
-------------------------------------------------------------------------------------------------------

Another way to offer an “interview inside an interview” is to populate variables and then delete them.

```
objects:
  - user_global: Individual
  - user: Individual
  - endpoint: DADict
---
mandatory: True
code: |
  while True:
    del endpoint[user.goal]
    del user
---
question: |
  What interview would you like to complete?
field: user.goal
choices:
  - Fruit quiz: fruit
  - Vegetable quiz: vegetable
  - Legume quiz: legume
---
code: |
  user.name.first = user_global.name.first
  user.name.last = user_global.name.last
---
code: |
  user.age_category = user_global.age_category
---
question: |
  What is your name?
fields:
  - First name: user_global.name.first
  - Last name: user_global.name.last
---
question: |
  How old are you, ${ user }?
field: user_global.age_category
choices:
  - "Spring chicken"
  - "The music I like isn't cool anymore"
  - "Wiser than most"
---
question: |
  Fruit quiz results
subquestion: |
  Your favorite fruit is
  ${ user.favorite_fruit }.
field: endpoint['fruit']
continue button label: Try again
---
question: |
  Vegetable quiz results
subquestion: |
  % if user.age_category == 'Spring chicken':
  You are still growing, ${ user }, so you should eat lots of vegetables.
  % endif
  
  Your favorite vegetable is
  ${ user.favorite_vegetable }.
field: endpoint['vegetable']
continue button label: Try again
---
question: |
  Legume quiz results
subquestion: |
  % if user.knows_legumes:
  ${ user } definitely knows what a legume is.
  % else:
  You don't know what a legume is.
  % endif
  
  % if user.age_category == 'Spring chicken':
  You are still growing, ${ user }, so you should eat lots of legumes.
  % endif
  
  Your favorite legume is
  ${ user.favorite_legume }.

field: endpoint['legume']
continue button label: Try again
---
question: |
  What is your favorite fruit?
fields:
  Favorite fruit: user.favorite_fruit
---
question: |
  What is your favorite vegetable?
fields:
  Favorite vegetable: user.favorite_vegetable
---
question: |
  What is your favorite legume?
fields:
  Favorite legume: user.favorite_legume
---
question: |
  Which of these are legumes?
fields:
  - no label: user.legume_picks
    datatype: checkboxes
    choices:
      - Peas
      - Lentils
      - Mango
      - String beans
      - Potato
      - Peanut
---
code: |
  if user.legume_picks['Peas'] \
     and user.legume_picks['Lentils'] \
     and user.legume_picks['String beans'] \
     and user.legume_picks['Peanut'] \
     and not user.legume_picks['Mango'] \
     and not user.legume_picks['Potato']:
    user.knows_legumes = True
  else:
    user.knows_legumes = False
```

[![Image 66: Screenshot of interview_in_interview example](https://docassemble.org/img/examples/interview_in_interview.png)](https://demo.docassemble.org/interview?i=docassemble.demo:data/questions/examples/interview_in_interview.yml&reset=1 "Click to try this interview")

The central logic of this interview is in the following [`code`](https://docassemble.org/docs/code.html) block:

```
mandatory: True
code: |
  while True:
    del endpoint[user.goal]
    del user
```

This is concise but cryptic, so it may be easier to understand what the interview is doing by writing out the variables for which [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) will seek definitions, in the order in which [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) will seek them:

```
mandatory: True
code: |
  while True:
    user.goal
    endpoint[user.goal]
    del endpoint[user.goal]
    del user
```

First, the interview asks for the goal (`user.goal`) – whether the user wants do an interview about fruit, vegetables, or legumes.

Next, it seeks an endpoint for that goal – a variable like `endpoint['vegetable']`. This results in the “sub-interview” being conducted. Once that endpoint is reached (e.g., when `endpoint['vegetable']` is set to `True` by the final question of the “sub-interview”), then the variables `endpoint['vegetable']` and `user` are deleted (using the [Python](https://en.wikipedia.org/wiki/Python_%28programming_language%29) `del` statement). Then the logic loops back around to where it began. At this point, `user.goal` will be undefined, because the entire variable `user` had been deleted. So the user will be presented with the “fruit, vegetable, or legume” choice again, and can choose to repeat the same “sub-interview,” or start a different “sub-interview.”

Note that an interview like this is different from an interview that concludes with a [restart button](https://docassemble.org/docs/questions.html#special%20buttons). While a [restart button](https://docassemble.org/docs/questions.html#special%20buttons) wipes out all of the user’s answers, this interview retains some of the information that was gathered. It does so by using two objects to track information about the user: information that is permanent is stored in the `user_global` object, and information that is temporary is stored in the `user` object.

Note that the interview developer only uses the object `user` when writing [`question`](https://docassemble.org/docs/questions.html#question)s that refer to characteristics of the user. The following [`code`](https://docassemble.org/docs/code.html) blocks assert that information about the `user`’s name and age should by defined by reference to attributes of the `user_global` object:

```
code: |
  user.name.first = user_global.name.first
  user.name.last = user_global.name.last
---
code: |
  user.age_category = user_global.age_category
```

This means that whenever the interview needs the definition of `user.name.first`, it will actually seek out `user_global.name.first`. If the user has been asked for their name before, no question needs to be asked; the [`code`](https://docassemble.org/docs/code.html) will take care of defining `user.name.first` and `user.name.last`. But other attributes, like `user.favorite_fruit`, are lost when the interview logic does ```
del
user
```. As a result, the interview will remember some answers and forget others.

Best practices for interview logic and organization[¶](https://docassemble.org/docs/logic.html#bplogic)
-------------------------------------------------------------------------------------------------------

*   Use only a single [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) [`code`](https://docassemble.org/docs/code.html) block for each interview, and put it at the top of the file after the [initial blocks](https://docassemble.org/docs/initial.html).

Best practices for sharing with others[¶](https://docassemble.org/docs/logic.html#bpsharing)
--------------------------------------------------------------------------------------------

*   Don’t reinvent the wheel; [`include`](https://docassemble.org/docs/initial.html#include) other people’s questions.
*   Share your [`question`](https://docassemble.org/docs/questions.html#question)s, [`code`](https://docassemble.org/docs/code.html), and [`template`](https://docassemble.org/docs/initial.html#template)s with others.
*   To that end, keep your [`question`](https://docassemble.org/docs/questions.html#question) blocks in a separate [YAML](https://en.wikipedia.org/wiki/YAML) file from your [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) interview logic, so that other people can incorporate your questions without having to edit your work. Your main interview file would consist only of:
    *   A [`metadata`](https://docassemble.org/docs/initial.html#metadata) block saying who you are and what your interview is for;
    *   A block to [`include`](https://docassemble.org/docs/initial.html#include) your file of questions;
    *   Any [`interview help`](https://docassemble.org/docs/initial.html#interview%20help) blocks;
    *   A [`default role`](https://docassemble.org/docs/initial.html#default%20role) block, if you use [roles](https://docassemble.org/docs/roles.html);
    *   Any [`initial`](https://docassemble.org/docs/logic.html#initial) code;
    *   Your [`mandatory`](https://docassemble.org/docs/logic.html#mandatory) code or questions that set your interview in motion.
*   [`include`](https://docassemble.org/docs/initial.html#include) other people’s question files directly from their **docassemble** packages, rather than by copying other people’s files into your package. That way, when the other developers make improvements to their questions, you can gain the benefit of those improvements automatically.
*   Don’t invent your own scheme for variable names; follow conventions and replicate what other people are doing.
*   If other people are including your questions and code, avoid changing your variable names unnecessarily, or else you will “break” other people’s interviews. This does limit your autonomy somewhat, but the benefits for the community of interview developers more than make up for the loss of autonomy.
