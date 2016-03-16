# Parsley Helpers

A scaffold for some useful functions to be used with the [Parsley JS validation library](http://parsleyjs.org/). In particular, functions that help Parsley to play well with conditionally shown/hidden form fields.

**[>> View the demo page](http://pixelsforhumans.github.io/parsley-helpers/)** 

Lots of documentation can be found in the code itself, so dive in. The basics are outlined below.


## Context

[Parsley](http://parsleyjs.org/) is a really useful, flexible JS library for handling client-side form validation. But there are some common situations where it needs some help.

Mainly, it was not initially easy for us to figure out how to use Parsley with a form that contained sections that were dynamically shown/hidden depending on the user's input. Parsley's docs have a section about [multi-step forms](http://parsleyjs.org/doc/examples/multisteps.html), but it doesn't cover what we were looking to do.

Having figured it out with the help of Stack Overflow – [here](http://stackoverflow.com/a/21885466), [here](http://stackoverflow.com/a/23690330) and [here](http://stackoverflow.com/a/27721395) – we thought we'd share our solutions, rough as they may be, in case they help others who are in the same situation we were.


## What the Parsley Helper functions do

We've included these basic features that we have found useful:

* __Basic validation function__ – Tells Parsley to validate a form, with a success callback and an error callback.
* __Add custom validators__ – We wrote or found a few custom validators (not included with Parsley out of the box) based on regular expressions, for validating dates, phone numbers, zip codes, and credit card numbers.
* __Enable/disable form fields within a content section__ – The basis for making sure Parsley validates the right fields.
* __Show/hide a content section__ – Builds on the enable/disable behavior above.

These functions are all defined in `parsley-helpers.js.` The [demo page](http://pixelsforhumans.github.io/parsley-helpers/) then provides examples for how you might use them.


## File structure

The major files to look at are as follows:

* __index.html__ – contains all the markup found on the [demo page](http://pixelsforhumans.github.io/parsley-helpers/).
* __assets/js/parsley-helpers.js__ – contains the basic function definitions mentioned above.
* __assets/js/demo.js__ – contains the custom JS that uses the Parsley Helpers to make the [demo page](http://pixelsforhumans.github.io/parsley-helpers/) do what it does.


## A few disclaimers

* This is probably obvious, but these Parsley Helpers functions are all based in jQuery (as is Parsley itself).
* This may also be obvious, but all of this was written by folks who are not exactly Level 10 JavaScript Warlocks. We think it's pretty airtight, but we are always learning. If you see things that could be made better, please fork/contribute/get in touch. Thanks!

