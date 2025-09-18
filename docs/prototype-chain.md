# 原型鏈 (Prototype Chain) - JavaScript的繼承基石

## 概述

原型鏈是 JavaScript 中實現繼承的核心機制。每個 JavaScript 對象都有一個內部屬性 `[[Prototype]]`（通常通過 `__proto__` 訪問），它指向另一個對象，形成了一條鏈式結構。

## 基礎概念

### 什麼是原型？

```javascript
// 每個函數都有一個 prototype 屬性
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
};

const john = new Person('John');
john.sayHello(); // "Hello, I'm John"

// john 對象的原型是 Person.prototype
console.log(john.__proto__ === Person.prototype); // true
```

### 原型鏈的查找機制

```javascript
const obj = {
    a: 1
};

// 當訪問屬性時，JavaScript 會沿著原型鏈查找
console.log(obj.a);        // 1 (在對象本身找到)
console.log(obj.toString); // function (在 Object.prototype 找到)
console.log(obj.nonExist); // undefined (整條鏈都沒找到)
```

## 原型鏈的構成

### 基本結構

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

// 設置繼承關係
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} barks!`);
};

const rex = new Dog('Rex', 'German Shepherd');

// 原型鏈：rex -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(rex.name);    // "Rex" (在實例上)
console.log(rex.bark());  // "Rex barks!" (在 Dog.prototype)
console.log(rex.speak()); // "Rex makes a sound" (在 Animal.prototype)
console.log(rex.toString()); // "[object Object]" (在 Object.prototype)
```

### 視覺化原型鏈

```javascript
// 檢查原型鏈
function checkPrototypeChain(obj) {
    let current = obj;
    let level = 0;
    
    while (current !== null) {
        console.log(`Level ${level}:`, current.constructor?.name || 'Object');
        current = Object.getPrototypeOf(current);
        level++;
    }
}

checkPrototypeChain(rex);
// Level 0: Dog
// Level 1: Animal  
// Level 2: Object
// Level 3: null
```

## 原型操作方法

### Object.create()

```javascript
// 創建具有指定原型的對象
const animalPrototype = {
    speak() {
        console.log(`${this.name} makes a sound`);
    }
};

const dog = Object.create(animalPrototype);
dog.name = 'Buddy';
dog.speak(); // "Buddy makes a sound"

// 創建純粹的對象（沒有原型）
const pureObject = Object.create(null);
console.log(pureObject.toString); // undefined
```

### Object.setPrototypeOf() 和 Object.getPrototypeOf()

```javascript
const animal = {
    type: 'animal'
};

const dog = {
    breed: 'labrador'
};

// 設置原型
Object.setPrototypeOf(dog, animal);

console.log(dog.type);  // "animal" (從原型獲得)
console.log(Object.getPrototypeOf(dog) === animal); // true

// 警告：修改原型鏈會影響性能
```

### hasOwnProperty() 和 in 操作符

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.species = 'Homo sapiens';

const alice = new Person('Alice');

console.log('name' in alice);           // true
console.log('species' in alice);       // true
console.log(alice.hasOwnProperty('name'));     // true
console.log(alice.hasOwnProperty('species'));  // false

// 遍歷自有屬性
Object.keys(alice);                     // ['name']
Object.getOwnPropertyNames(alice);      // ['name']

// 遍歷所有可枚舉屬性（包括繼承的）
for (let prop in alice) {
    console.log(prop); // 'name', 'species'
}
```

## 類與原型

### ES6 類的原型本質

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    bark() {
        console.log(`${this.name} barks!`);
    }
}

// ES6 類實際上是原型的語法糖
console.log(typeof Animal);              // "function"
console.log(Animal.prototype.speak);     // function
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
```

### 靜態方法和原型方法

```javascript
class MathUtils {
    constructor(value) {
        this.value = value;
    }
    
    // 實例方法（在原型上）
    double() {
        return this.value * 2;
    }
    
    // 靜態方法（在構造函數上）
    static add(a, b) {
        return a + b;
    }
}

const math = new MathUtils(5);
console.log(math.double());           // 10
console.log(MathUtils.add(3, 4));     // 7

// 靜態方法不在原型鏈中
console.log(math.add);                // undefined
console.log(MathUtils.prototype.add); // undefined
```

## 原型汙染攻擊

### 什麼是原型汙染？

```javascript
// 危險示例：不要在實際代碼中這樣做
const maliciousPayload = {
    "__proto__": {
        "isAdmin": true
    }
};

// 模擬不安全的對象合併
function merge(target, source) {
    for (let key in source) {
        if (typeof target[key] === 'object' && typeof source[key] === 'object') {
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

const user = { name: 'John' };
merge(user, maliciousPayload);

// 現在所有對象都有 isAdmin 屬性！
const anotherUser = {};
console.log(anotherUser.isAdmin); // true（危險！）
```

### 防範原型汙染

```javascript
// 1. 使用 Object.create(null) 創建純對象
const safeObject = Object.create(null);
safeObject.data = 'safe';

// 2. 檢查危險的鍵名
function safeMerge(target, source) {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    
    for (let key in source) {
        if (dangerousKeys.includes(key)) {
            continue; // 跳過危險的鍵
        }
        target[key] = source[key];
    }
    return target;
}

// 3. 使用 Object.freeze() 凍結原型
Object.freeze(Object.prototype);

// 4. 使用 Map 而不是普通對象存儲動態數據
const safeMap = new Map();
safeMap.set('user_input', value);
```

## 實用模式

### Mixin 模式

```javascript
// 創建 mixin
const CanFly = {
    fly() {
        console.log(`${this.name} is flying!`);
    }
};

const CanSwim = {
    swim() {
        console.log(`${this.name} is swimming!`);
    }
};

// 應用 mixin
function Duck(name) {
    this.name = name;
}

Object.assign(Duck.prototype, CanFly, CanSwim);

const donald = new Duck('Donald');
donald.fly();  // "Donald is flying!"
donald.swim(); // "Donald is swimming!"
```

### 工廠模式結合原型

```javascript
function createAnimal(type, name) {
    const animal = Object.create(animalMethods);
    animal.type = type;
    animal.name = name;
    return animal;
}

const animalMethods = {
    speak() {
        console.log(`${this.name} the ${this.type} makes a sound`);
    },
    
    eat(food) {
        console.log(`${this.name} eats ${food}`);
    }
};

const cat = createAnimal('cat', 'Whiskers');
const dog = createAnimal('dog', 'Buddy');

cat.speak(); // "Whiskers the cat makes a sound"
dog.speak(); // "Buddy the dog makes a sound"
```

## 效能考慮

### 原型鏈長度的影響

```javascript
// 測試不同原型鏈長度的性能
function createChain(depth) {
    let current = {};
    for (let i = 0; i < depth; i++) {
        const next = {};
        Object.setPrototypeOf(next, current);
        current = next;
    }
    current.deepProperty = 'found';
    return current;
}

const shortChain = createChain(1);
const longChain = createChain(10);

// 訪問深層屬性的性能差異
console.time('short chain');
for (let i = 0; i < 1000000; i++) {
    shortChain.deepProperty;
}
console.timeEnd('short chain');

console.time('long chain');
for (let i = 0; i < 1000000; i++) {
    longChain.deepProperty;
}
console.timeEnd('long chain');
```

### 屬性查找優化

```javascript
// 優化：在實例上快取常用屬性
function OptimizedClass() {
    // 將常用方法快取到實例上
    this.frequentMethod = OptimizedClass.prototype.frequentMethod;
}

OptimizedClass.prototype.frequentMethod = function() {
    return 'result';
};

OptimizedClass.prototype.rareMethod = function() {
    return 'rare result';
};

const instance = new OptimizedClass();
// instance.frequentMethod 現在是直接屬性訪問，而不是原型查找
```

## 調試技巧

### 檢查原型鏈

```javascript
function analyzeObject(obj, name = 'object') {
    console.log(`\n=== ${name} ===`);
    console.log('Own properties:', Object.getOwnPropertyNames(obj));
    console.log('Prototype:', Object.getPrototypeOf(obj));
    console.log('Constructor:', obj.constructor?.name);
    
    // 顯示完整原型鏈
    let current = obj;
    let level = 0;
    while (current && level < 10) { // 防止無限循環
        console.log(`Level ${level}:`, current.constructor?.name || 'Anonymous');
        current = Object.getPrototypeOf(current);
        level++;
    }
}

// 使用示例
class A {}
class B extends A {}
const instance = new B();

analyzeObject(instance, 'B instance');
```

## 最佳實踐

1. **優先使用 ES6 類語法**：更清晰和易讀
2. **避免直接修改原型**：使用 Object.create() 或類繼承
3. **注意原型汙染**：驗證用戶輸入，避免設置危險屬性
4. **適度使用繼承**：過深的繼承鏈會影響性能
5. **使用 hasOwnProperty 檢查自有屬性**
6. **了解內建對象的原型**：如 Array.prototype, Object.prototype

## 總結

原型鏈是 JavaScript 中強大而靈活的特性，它提供了繼承和代碼重用的機制。理解原型鏈的工作原理對於編寫高效、安全的 JavaScript 代碼至關重要。雖然 ES6 類語法提供了更熟悉的面向對象編程體驗，但它底層仍然基於原型機制。掌握原型鏈能讓你更好地理解 JavaScript 的本質，並編寫出更優秀的代碼。