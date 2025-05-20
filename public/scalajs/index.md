---
title: ScalaJS
date: '2025-05-20'
spoiler: "The limits of my language mean the limits of my world."
---

Welcome to Scala.js

```js eval
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
  Hello, <i>Alice</i>!
</p>
```

```js
import Bar from "mod.js"
```

```scala
@js.native
@JSImport("mod.js", JSImport.Default)
object Bar extends js.Object
```


```js
<Counter />
```

```js eval
<p>
  <Counter />
</p>
```