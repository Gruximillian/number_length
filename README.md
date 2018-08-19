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
console.log(number3String.length); // 19 -> nice, still works even though we have passed the Number.MAX_SAFE_INTEGER value
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

For some reason `.length` property of the `number4String` variable returns 14 instead of 41 as we might expect. That means that the string has only 14 characters even though the number has 41 digits. In order to see what happened to our string representation of the `number4` variable we can simply log that string representation and see what it looks like. In fact, let's log all the previous ones so that we can compare them.

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

Look at that, the last number is represented in a [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation) to reduce the number of digits used. The `number4String` variable does have 14 characters and all zeros are crammed into the exponent `e+40`.

## Finding the solution

To find the solution for this problem we need to think a bit. We can't use `.length` method but we still have a number which we can use for performing calculations.

### Brute force calculation

Assuming our number is in the decade number system we can use a simple math operation to figure out the number of digits.

For example, let's have a number 100. It is obvious that there are 3 digits in this number, but how can we actually get that information by performing some calculation?

So, we need to get number 3 from number 100 by doing some math. We can try and divide it by 33.33 and we'd get pretty close to 3. The only problem is that this approach won't work for, say number 200, and we need it to work for every 3 digit number, from 100 to 999.

Obviously, addition, subtraction and multiplication won't work here for all of those numbers, so we can conclude that the division is still a way to go. We just need to find the best number to divide with.

What we really need is that when we divide the number once, the result actually has one digit less than the starting number. You say: "Ok, but we can divide 100 with any number and get one less digit, how does that help?". That's a good observation and it leads us to the next condition, we actually need to be able to divide 999 with the same number and also get the resulting number which has one less digit than 999. So now, we see that none of the numbers in the range 1-9 won't do the trick.

**Let's try dividing 100 with 10.**

First division:

| original number | divided by 10 | result number of digits |
| :-------------: | :-----------: | :---------------------: |
| 100             | 10            | 2                       |

Second division:

| original number | divided by 10 | result number of digits |
| :-------------: | :-----------: | :---------------------: |
| 10              | 1             | 1                       |

**Now let's try dividing 999 with 10.**

First division:

| original number | divided by 10 | result number of digits |
| :-------------: | :-----------: | :---------------------: |
| 999             | 99.9          | 3                       |

Second division:

| original number | divided by 10 | result number of digits |
| :-------------: | :-----------: | :---------------------: |
| 99.9            | 9.99          | 3                       |

Hmmm, so... no luck!? No, not really. Total number of digits is not decreasing in the second example, but the number of digits in front of the decimal point actually does, and it decreases the same way as the number of digits in the first example. Let's track the digits in front of the decimal point now:

First division:

| original number | divided by 10 | result number of digits in front of the decimal point |
| :-------------: | :-----------: | :---------------------------------------------------: |
| 999             | 99.9          | 2                                                     |

Second division:

| original number | divided by 10 | result number of digits in front of the decimal point |
| :-------------: | :-----------: | :---------------------------------------------------: |
| 99.9            | 9.99          | 1                                                     |

We see that the number of divisions was 2 and we got to one digit in the number. But we know that there are 3 digits in the original number. So, if we divide once more we get 0.1 and 0.999 for these two cases.

By now it might be obvious what is our final goal... to get the value to be less than 1 by repeatedly dividing with number 10.

In this examples, we did 3 divisions which matches with the number of digits in both numbers. If we try this with 384698, for example, you get this:

* division 1 => 38469.8  > 1 => one digit
* division 2 => 3846.98  > 1 => two digits
* division 3 => 384.698  > 1 => three digits
* division 4 => 38.4698  > 1 => four digits
* division 5 => 3.84698  > 1 => five digits
* division 6 => 0.384698 < 1 => six digits

We get that this number has 6 digits, which is correct.

All this was just some simple math, now we need to translate that into a program which will do this calculations. First let's clearly define what we need to do:

**While the number is greater or equal than 1, divide it by 10 and increment number of digits by one on each division.** 

This statement literally tells us how we should program it. By using the `while` loop:

```javascript
let number = 468168;
let length = 0;
while (number >= 1) {
    number = number / 10;
    length++;
}
console.log(length); // 6
```

This will always work in math, though not always in JavaScript because its floating point weirdness, but it will work in most of the cases and it's best that we can do with calculation.

### Using the exponent

There's another way to get the number of digits that does not require us to calculate anything and we can use JavaScript's built-in methods to get what we want. Let's see how can we do that.

Ok, so the problem is that the number is written in the [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation) which limits the number of characters in its string representation and we can't use `.length` string method to get the number of digits. But we can use the information from that scientific notation to actually get the number of digits. In order to do so, let's write a number in scientific notation:

```javascript
const number = 3.1131e+7 // this is 31 131 000
```

We see that the number of digits should be 8 fo this number. Let's do another one:

```javascript
const number = 7.35e+17 // this is 735 000 000 000 000 000
```

This one has 18 digits. We can see a pattern now, the number displaying the exponent value actually tells us how many digits there are after the decimal point. We see two digits from the number and the rest of them are all zeroes, all together making 17 digits. All we need to do to get the complete number of digits is to add one that was in front of the decimal point and we get the correct value of 18 digits.

All we have to do is to read the exponent and add one to it and we're done:

```javascript
const number = 4.68e+25;
const string = number.toString();
const exponent = string.split('e')[1].substring(1);
const numberOfDigits = parseInt(exponent) + 1;
console.log(numberOfDigits); // 26
```

What did we do here? On the second line, we transformed the number to string in order to be able to use string methods. On line 3 we do several things. First we split the `string` on the character `e` (`string.split('e')`) and get the array with two strings `['4.68', '+25']`. The second member of this array is the exponent value, so we access it with `string.split('e')[1]`. Now that we have a string with the exponent value, we are only interested in the number, not the sign. Therefore, we can use `.substring` method to get everything after the plus sign `string.split('e')[1].substring(1)`. Now we have the string '25' and we need to add one to it in the next line, but we need to take care to not concatenate number 1 to this string. That's why we use `parseInt()` method to make string '25' into a number and to safely do the addition.

Now, there's one thing to have in mind here. Number `4.68e+25` can also be written as `46.8e+24` or `468e+23` or `4680e+22`, etc. The number of digits is still the exponent value plus the number of digits in front of the decimal point, so it's always 26. As long as the value is of type `number` we're ok. The issue here is when we get this as a string, not as the number, and most of the times we get values from the input fields which usually get us strings. If we were to apply our solution to the string written like this, we'd get the wrong results. Luckily, this is easy to fix, all we need to do is to cast the string we got into the number and then again back to string and then we can apply our solution on that string:

```javascript
const value = '468e+23';
const number = Number(value); // this re-formats the number into '4.68e+25';
const string = number.toString();
const exponent = string.split('e')[1].substring(1);
const numberOfDigits = parseInt(exponent) + 1;
console.log(numberOfDigits); // 26
```

Of course, if we get the number represented normally, that is, not in the scientific notation, then this method will again fail. Because of that we need to add a condition that checks the format of our number. Let's wrap this into a function and add this check:

```javascript
function getDigits(value) {
    const number = Number(value);
    const string = number.toString();
    const hasExponent = string.indexOf('e') !== -1; // is the number written using the scientific notation
    
    if (hasExponent) {
        const exponent = string.split('e')[1].substring(1);
        return parseInt(exponent) + 1;
    }

    return number.toString().length;
}

// as strings
console.log(getDigits('468e+23')); // 26
console.log(getDigits('12345678')); // 8
// as numbers
console.log(getDigits(468e+23)); // 26
console.log(getDigits(12345678)); // 8
```

Here, if there's the exponent part in the number, we dissect the number to get the exponent and return the exponent value plus 1. If there's no exponent, we return `number.toString().length` which directly gives us the number of digits.

## Example app

I made a simple application where you can enter a number in the input field and see the effects of the methods described in this article. Just follow the link below:

[Example application](https://gruximillian.github.io/number_length/app/)

## Conclusion

The issue described in this article is something that we rarely encounter in practice but in my opinion it is worth having this in mind. The solution is not that hard, especially for the experienced developers, but for inexperienced developers this might be a problem and they might straight up not even realize there is a problem since `number.toString().length` works well for up to about 22 digit long numbers, after that things start to me more "scientific". :D

I hope you learned something new or at least had some fun reading this. Thank you for reading!
