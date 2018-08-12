# How many digits there are in a number [Work In Progress]

While working as a developer you might sometimes get tasks that require some unusual things to be done or information to get, or you might just want to know something, for the sake of knowing. Some of those tasks can be straightforward and some might not. But it might happen that the task seems to be straightforward, but there's some gotcha waiting to bite you if you are not careful enough.

In this short article, I'd like to share my experience with one of those situations where there was seemingly straightforward solution, but in fact that solution wasn't giving the proper result in all cases.

## The problem

The problem was pretty simple: **determine how many digits there are in a number**. That doesn't seem too complicated, right? Many JavaScript objects have `.length` property to easily determine the length of the object. The only problem is that the *`Number`* object doesn't have `.length` property, but maybe we could transform our number into another object that has that property so we can then use it to figure out the number of digits in the initial number?! That seems like a good starting point, so let's try it.

> **Note:** For the sake of simplicity we will only deal with positive integers. The main idea will hold for negative and floating point numbers, but the implementation will require much more conditions and checks.

## Stringify the *`Number`*

When we look at the number it is just a string of digits. So, it makes sense to try and convert the number into a string, and luckily, the strings have a `.length` property which gives us the number of characters in the string. That seems like a solution, it's all that we want! Let's try it.

```javascript
const number = 12345; // obviously has five digits
const numberString = number.toString(); // this is now a string '12345'

// let's log the string length now
console.log(numberString.length);

// 5 -> as expected, there are five characters in this string, accounting for five digits in the number
```

It really worked and we're happy that this task is solved. Let's just play with a bit more numbers to make sure it works.

```javascript
const number1 = 1234567890;
const number1String = number1.toString();
console.log(number1String.length); // 10 -> works

const number2 = 123456789000000;
const number2String = number2.toString();
console.log(number2String.length); // 15 -> nice, still works

const number3 = 1234567890000000000;
const number3String = number3.toString();
console.log(number3String.length); // 19 -> nice, still works event we have passed the Number.MAX_SAFE_INTEGER value
```

This is lookig really good so far. Let's give it some really large number, just for fun.

```javascript
const number4 = 12345678900000000000000000000000000000000;
const number4String = number4.toString();
console.log(number4String.length); // 14 -> awesome still wo.... Wait! What? Fourteen!?
```

Ooops! This should have been 41, but it turned out 14. As usual, just when you think you're done, solved the problem, you stumble upon a case that breaks your solution. :(

Time to debug.

## The cause of the issue

For some reason `.length` property of the `number4String` variable returns 14 instead of 41 as we might expect. That means that the string has only 14 characters even though the number has 41 digit. In order to see what happened to our string representation of the `number4` variable we can simply log that string representation and see what it looks like. In fact, let's log all the previous ones so that we can compare them.

```javascript
const number1 = 1234567890;
const number1String = number1.toString();
console.log(number1String); // '1234567890' -> fine
console.log(number1String.length); // 10 -> works

const number2 = 123456789000000;
const number2String = number2.toString();
console.log(number2String); // '123456789000000' -> fine
console.log(number2String.length); // 15 -> works

const number3 = 1234567890000000000;
const number3String = number3.toString();
console.log(number3String); // '1234567890000000000' -> fine
console.log(number3String.length); // 19 -> works

const number4 = 12345678900000000000000000000000000000000;
const number4String = number4.toString();
console.log(number4String); // '1.23456789e+40' -> oh! ah! uh! of course!
console.log(number4String.length); // 14 -> wrong
```

Look at that, the last number is represented in a [scientific notation](#scientific-notation) to reduce the number of digits used. The `number4String` variable does have 14 characters and all zeros are crammed into the exponent `e+40`.

## Scientific notation

TODO

## Example app

[Example application](https://gruximillian.github.io/number_length/app/)
