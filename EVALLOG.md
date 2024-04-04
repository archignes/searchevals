# Eval Log

The purpose of this log is to document the process of adding evals.

## 2024-03-25

### 2024-03-25 15:55:59

Looking back through my notes for an eval to add. When I find potential evals I do not yet have a system for saving them in one space.

I saw several from Lily Ray recently. She is definitely a public figure, particularly within the search space. 90K+ followers on Twitter. Meets the indeterminate threshold for notability.

https://twitter.com/lilyraynyc/status/1771217301863289140

Using the userscript it was an easy add:

output: 
```json
,
{
  "id": "lilyraynyc",
  "name": "Lily Ray ",
  "role": "SEO",
  "URL": "https://twitter.com/lilyraynyc",
  "conflict": []
}
```

Clunky and not yet directly into a queue for moderation or validation. I take that and add to evaluators.json.

They query is not currently extracted (the screen shot isn't shown next to the eval form input either...), which takes time to click back and find.

I type the query manually, reading from the screenshot: [pitbull puppy for sale craigslist]

Click the Searchevals.extract button again. I need to double check spacing, because the extraction is not perfect. There are new lines that need to be rendered. I can't see if that is happening in the form, so just need to double check the output...

The 'Systems' field is not currently properly populated for validated with anything, so I often just put 'google' in because it passes the check to export the json output.

The images is supposed to be automatic, so not editable, but doesn't work. So have to wait for the output...

```json
,
{
  "id": "eval-nqu2bmle9",
  "date": "2024-03-22",
  "query": "pitbull puppy for sale craigslist",
  "url": "https://twitter.com/lilyraynyc/status/1771217301863289140",
  "systems": [
    "google"
  ],
  "content": "OH GOOD. SGE WILL EVEN RECOMMEND THE SPAM SITES AS PART OF THE ANSWER.",
  "evaluator_id": "lilyraynyc"
}
```

Then I need to transform that, especially the ID (which ideally might read from evaluators.json)...

I currently show images via the URL, I need to develop a firmer stance on that.

Find the escape for the newlines and add it.
Copy an existing image object and add it.
I need to add google-sge as a distinct system I think.

```json
{
  "id": "pitbull-puppy-for-sale-craigslist-lilyraynyc",
  "date": "2024-03-22",
  "query": "pitbull puppy for sale craigslist",
  "url": "https://twitter.com/lilyraynyc/status/1771217301863289140",
  "systems": [
    "google-sge"
  ],
  "content": "OH GOOD.\\n\\nSGE WILL EVEN RECOMMEND THE SPAM SITES AS PART OF THE ANSWER.",
  "evaluator_id": "lilyraynyc",
  "images": [
    {
      "url": "https://pbs.twimg.com/media/GJSgsp5WwAA8uau?format=png&name=medium"
    }
  ]
}
```

I think this works, minus the new system. I'll quickly add that via the [searchevals.com/input](https://searchevals.com/input) form:

```json
{
  "id": "google-sge",
  "name": "Google SGE",
  "search_link": "https://www.google.com/search?q=test",
  "nondistinct_url": false,
  "base_url_for": [
    "google"
  ]
}
```

Oh, and I think the logic is broken on that. I think the output should be: `"nondistinct_url": true` and the `base_url_for` needs to be added to `google` (as far as I know there isn't a param to trigger SGE).

```json
{
  "id": "google-sge",
  "name": "Google SGE",
  "search_link": "https://www.google.com/search?q=test",
  "nondistinct_url": true,
}
```

Since I'm building out SearchSystems, I'm going to edit systems.json over there....
- 2024-03-25 16:13:47
- 2024-03-25 16:17:08 done. added, validated with `npm test`, fixed a missing comma, and reformatted with `npm run format`...

Now checking the dev site... `npm run dev`

Looking at it I realize I need to add a note about annotation...

And that is done: 2024-03-25 16:21:16

21 minutes... and I still need to push live to get the screenshot added properly...



### 2024-03-25 17:51:01

https://twitter.com/kelseyhightower/status/1763370577765777632

234.8K Followers

Prominent voice in tech.

https://en.wikipedia.org/wiki/Kelsey_Hightower

Software engineer (including at Google formerly) and developer advocate

In this case the image did populate.


Even then it did not populate in the exported JSON.

Done. 2024-03-25 18:04:20

Part of the issue is the multi-step manual work might include or need to navigate multiple distractions...

### 2024-03-25 18:04:54

```
,
{
  "id": "247-basketball-recruiting-lilyraynyc",
  "date": "2024-03-22",
  "query": "247 basketball recruiting",
  "url": "https://twitter.com/lilyraynyc/status/1771225964325790033",
  "systems": [
    "google-sge"
  ],
  "content": "Hey @247Sports make sure your users don't click this link in Google's SGE, it will take them to a porn website.",
  "evaluator_id": "lilyraynyc",
  "images": [
    {
      "url": "https://pbs.twimg.com/media/GJSoPu-WMAArdWJ?format=jpg&name=medium"
    }
  ]
}
```

## 2024-03-26

### 2024-03-26 09:58:21

[Adam Selipsky](https://twitter.com/aselipsky/status/1770173447106392182)

CEO AWS

Wanna check quickly how I phrased that for other CEOs...: `CEO at` 

Used a screenshot and OCR shortcut I wrote to get the query quickly-ish...

[How does Perplexity’s use of AWS technology improve their search platform?]


Ahhh... Adding this:   "media": "video - unsupported at this time"

Again, the id is annoying... 

OK. Added a div to show videos are not supported. Wondered what to do about "conflict"...

I added Perplexity AI, then was very pleased with the suggested search on Perplexity...

It showed me a nearly identical endorsement from Selipsky on LinkedIn.

So now I want to add some field that lets me link to 'syndicated'? or alternative platforms for the same eval?

Very fiddly. Done. 2024-03-26 10:44:41


## 2024-04-02
## 2024-04-02 22:03:59

https://twitter.com/deliprao/status/1773466735363952722

How might I handle comments on other evals?

Going to just add this for now: 
https://twitter.com/RichardSocher/status/1773465458827792566

Done. 2024-04-02 22:11:18

## 2024-04-02 22:11:27

This is in my notes: https://community.mojeek.com/t/testing-mojeek-summary/982/14

[What do we know about UAPs?]

OFF twitter
CEO of Mojeek
I still compiled the evaluator extract from Twitter, via a random tweet.

```
,
{
  "name": "Colin Hayhurst",
  "id": "ColinHayhurst",
  "role": "CEO at Mojeek",
  "URL": "https://twitter.com/ColinHayhurst",
  "conflict": ["mojeek"]
}
```

Then going to /input to try adding the eval itself.

excerpting:

Firstly the summariser is not so different from the RAG protoype at labs.mojeek.com. The summaries on both are the pulling the same information from the search results; actually from the snippets of the top 8 ranked search results. The differences are more in the UI; both are showing the search results (only 8 in the case of labs.mojeek.com) with those results cited in the “Summary”/“Answer”.

When search results give you links to less mainstream sources, the same will be true in both these AI answers. 

You may note that when you hover over a citation in the summary the corresponding results on the vertical search links is highlighted:
https://community.mojeek.com/uploads/default/optimized/1X/9bd277961318d7b2682c51812d6d07ede2d9e92a_2_1000x1000.png

Here is the same result in RAG, labs.mojeek.com, with the main differences being here the addition of suggested “Related” queries and a limit of 8 results aka “Sources”:
https://community.mojeek.com/uploads/default/optimized/1X/6d93b47b2b56185afc5100c3bdaed836e9639ef2_2_1000x1000.png


On Google Gemini and Bard Copilot you get the following, evidently with more mainstream sources:
https://community.mojeek.com/uploads/default/original/1X/20b6b96571af1846be4f6ede61923d250215dc44.png
https://community.mojeek.com/uploads/default/optimized/1X/e58f46b272df3f184b2e9b3e79d896923ab4086c_2_1000x1000.png


I need to add mojeek to the systems.json file too

I haven't yet implemented pulling from the SearchSystems api.

Added. Done. 2024-04-02 22:43:58


### 2024-04-02 22:45:07

https://twitter.com/aworldtravelguy/status/1773935304002400766/photo/4
this is a smaller account, but clearly a tweet meant for publicity (which it received)
also a verified account, and public blogger
David Leiter
[huchuy picchu]

done... 2024-04-02 22:52:58

### 2024-04-02 22:53:02
https://twitter.com/lilyraynyc/status/1774966272536494312

"ip-cloaked spam"

problem for my current approach is I don't know the query

### 2024-04-02 22:59:06 

https://twitter.com/weirdmedieval/status/1766087285911523627

large account


686.4K Followers

[medieval manuscript frog]

done... 2024-04-02 23:09:23

### 2024-04-02 23:10:58

https://twitter.com/mojeek/status/1774436745506963701

- add evaluator

[how long does magnus carlsen study chess]

-- What type of query might this be? A certain type of ambiguous, unspecified?

done 2024-04-02 23:16:32

### 2024-04-02 23:19:03

https://twitter.com/jiayq/status/1774943275063157192

new evaluator: jiayq; 11k+ followers, tweeting for the public
new system: devv ai

I got a little distracted adding new Evaluator and System pages and then finally adding this one.

### 2024-04-04 13:34:59

https://twitter.com/idkfa3/status/1775941331606700244:
  username: idkfa3
  name: Name not found
  source: Twitter
  date: Apr 4, 2024
  text: |
    @Google How do I turn off AI generated search results?<br>
    <br>
    I asked AI and it gave me the wrong answer.

- 4k+ followers
- tagged @Google
- I interacted with this tweet w/ RT and Like

I think I should add this, but I want to first add a feedback link like I have on Searchjunct so that people can more quickly and easily report any issues to get their eval removed.

I'll use https://www.radix-ui.com/icons ChatBubbleIcon atop the EvalCard.



