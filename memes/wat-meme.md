# Wat - The Infamous JavaScript Meme

![Wat Meme](https://i.imgur.com/0H7J3YK.gif)

## The Code
```javascript
console.log([] + []);           // ""
console.log([] + {});           // "[object Object]"
console.log({} + []);           // 0
console.log({} + {});           // [object Object][object Object]
console.log([] - {});           // NaN
console.log({} - []);           // NaN
```

## 解釋

This meme highlights some of JavaScript's type coercion quirks:

1. `[] + []` - Empty arrays are converted to empty strings and concatenated
2. `[] + {}` - Empty array becomes "", empty object becomes "[object Object]"
3. `{} + []` - The `{}` is treated as a code block, leaving `+[]` which converts the empty array to 0
4. `{} + {}` - In most browsers, this is string concatenation of two "[object Object]" strings
5. `[] - {}` - Both are converted to numbers (0 and NaN), resulting in NaN
6. `{} - []` - Similar to above, both are converted to numbers

## Why This Happens

JavaScript's type coercion rules can be surprising. The `+` operator has different behaviors based on the types of its operands, leading to these sometimes unexpected results. This is why many developers recommend using `===` (strict equality) instead of `==` (loose equality) in JavaScript.

## Related Concepts
- Type Coercion
- Truthy/Falsy values
- The Abstract Equality Comparison Algorithm
