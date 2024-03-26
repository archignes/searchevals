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


