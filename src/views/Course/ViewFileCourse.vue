<script setup lang="ts">
import { cloneDeep } from 'lodash';
import CourseNavigation from './CourseNavigation.vue';
const course = {
  key: 'solidity-course',
  title: 'Solidity Course',
  summary: 'This is a Solidity Course',
  description: '"Line1" \n"Line2" \n"Line3"\n',
  duration: '45 - 60 mins',
  topics: [
    {
      title: 'Data Types',
      summary: 'This chapter explains the basics of data types used in Solidity.',
      key: 'data-types',
      order: 0,
      questions: [
        {
          uuid: '89128b13-bd0f-4887-85c4-1308dfbc3234',
          type: 'MultipleChoice',
          content: 'Which of the following are not valid data types in solidity?',
          hint: 'noHint',
          explanation: 'floating point data and character data types are not valid in solidity.',
          answerKeys: ['B', 'D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'bool',
              key: 'A'
            },
            {
              content: 'float',
              key: 'B'
            },
            {
              content: 'address',
              key: 'C'
            },
            {
              content: 'char',
              key: 'D'
            }
          ]
        },
        {
          uuid: '5413170f-f8c0-40fd-b17a-9481650eaa72',
          type: 'SingleChoice',
          content: 'What is the default value of int data type in solidity?',
          hint: 'noHint',
          explanation: 'null and undefined do not exist in solidity.',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'null',
              key: 'A'
            },
            {
              content: '0',
              key: 'B'
            },
            {
              content: 'undefined',
              key: 'C'
            },
            {
              content: '1',
              key: 'D'
            }
          ]
        },
        {
          uuid: '165cc35e-7d95-4273-a61a-621916e5ef05',
          type: 'SingleChoice',
          content: 'Which of the following statements is incorrect regarding data types in solidity?',
          hint: 'noHint',
          explanation:
            'The range of uintx in solidity is $[0,2^x -1]$, the range of intx is $[-2^{x-1},2^{x-1}-1]$ , boolean values only take true/false values and address literals take 20 bytes hexadecimal values.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: 'The range of uint32 data type is from 0 upto $2^{32} -1$',
              key: 'A'
            },
            {
              content: 'Bool data type can only take true and false values.',
              key: 'B'
            },
            {
              content: 'The range of int256 data type is from $-2^{256}+1$ to $2^{256}-1$',
              key: 'C'
            },
            {
              content: 'address data type holds a 20 byte value',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'f54382c5-2dfc-4cd8-9e29-5d764cf59d53',
          type: 'SingleChoice',
          content: 'Which of the following statements about address data type in solidity are not correct?',
          hint: 'address holds a 20 byte value.',
          explanation: 'address payable is same as address but with aditional members send and transfer.',
          answerKeys: ['A', 'B', 'D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: 'Address payable has a larger size compared to address.',
              key: 'A'
            },
            {
              content: 'Implicit type conversion from address payable to address are not allowed.',
              key: 'B'
            },
            {
              content:
                'If you need a variable of type address and plan to send Ether to it, then declare its type as address payable.',
              key: 'C'
            },
            {
              content: 'Explicit conversion of data type byte 32 to address is allowed.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'd5773538-949b-4909-b91e-5f035808b8bc',
          type: 'SingleChoice',
          content: 'Which of the following is not a valid member of type `address`?',
          hint: 'noHint',
          explanation:
            'keccak256 is a globally available function in solidity used to calculate the `keccak256` hash of an input . balance , codehash and transfer are methods of the address type.',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'balance',
              key: 'A'
            },
            {
              content: 'keccak256',
              key: 'B'
            },
            {
              content: 'codehash',
              key: 'C'
            },
            {
              content: 'transfer',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b6a45240-74b1-4243-b3b1-9c42c154be7e',
          type: 'MultipleChoice',
          content: 'Which of the following are true regarding constant and immutable variables in solidity?',
          hint: 'these variables cannot be modified after the contract has been constructed.',
          explanation:
            'For constant variables, the value has to be a constant at compile time and it has to be assigned where the variable is declared whearas immutables are a little less restrictive and can be assigned an arbitrary value in the constructor of the contract or at the point of their declaration.',
          answerKeys: ['A', 'C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content:
                'For constant variables, the value has to be fixed at compile-time. For immutable, value can be assigned at construction time.',
              key: 'A'
            },
            {
              content:
                'Compared to regular state variables, the gas costs of constant & immutable variables are much higher.',
              key: 'B'
            },
            {
              content: 'Variables declared as immutable are a bit less restricted than those declared as constant.',
              key: 'C'
            },
            {
              content: 'Immutable variables can be assigned more than once.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b0c8e946-2740-499a-9863-3173f1dc8a52',
          type: 'SingleChoice',
          content: 'in solidity `0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF` is an example of-',
          hint: 'noHint',
          explanation: 'addresses holds 20 byte hexadecimal literals.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'address',
              key: 'A'
            },
            {
              content: 'uint',
              key: 'B'
            },
            {
              content: 'string',
              key: 'C'
            },
            {
              content: 'array',
              key: 'D'
            }
          ]
        },
        {
          uuid: '944228da-440e-43d3-b0b8-a9a3751aa5b9',
          type: 'SingleChoice',
          content: 'which of the following is not a valid `array` declaration?',
          hint: 'noHint',
          explanation:
            '`type arrayName [ arraySize ];` declares an array of fixed size in Solidity,\n`type[] arrayName;` declares an array of dynamic size in solidity.\n',
          answerKeys: ['D'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`uint arr[10];`',
              key: 'A'
            },
            {
              content: '`int []arr;`',
              key: 'B'
            },
            {
              content: '`uint arr[] = [1,2,3];`',
              key: 'C'
            },
            {
              content: '`int [3]arr;`',
              key: 'D'
            }
          ]
        },
        {
          uuid: '42d6e1ad-75b3-41a8-88d7-7aa7f958619f',
          type: 'SingleChoice',
          content:
            'What will be the value of `arr[arr.length-2]` after execution of the following code?\n```\n        uint[] arr;\n        arr = [1,2,3];\n        arr.push(1);\n        arr.push(2);\n        delete arr[1];\n        arr.pop();\n```\n',
          hint: 'delete method does not change the length of the array.',
          explanation:
            '`array.push(x)` is used to add element x to the end of the array , `array.length` returns the length of the array \nand `delete array[x]` deletes the item at index x of the array and leaves all other elements and the length of \nthe array untouched.\n',
          answerKeys: ['D'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: '1',
              key: 'A'
            },
            {
              content: 'undefined',
              key: 'B'
            },
            {
              content: '2',
              key: 'C'
            },
            {
              content: '3',
              key: 'D'
            }
          ]
        },
        {
          uuid: '2865fa2d-80a9-468d-9332-ab73613c216e',
          type: 'MultipeChoice',
          content: 'Which of the following statements is correct about arrays in solidity ?',
          hint: 'arrays in solidity are homogenous.',
          explanation:
            '`arrays` in solidity can store "value-types" like boolean , integers etc and can be declared with the new keyword. \nArray indexing in solidity starts with 0 like most other programming languages.\n',
          answerKeys: ['B', 'C', 'D'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'They can hold values of different data types.',
              key: 'A'
            },
            {
              content: 'They can hold primitive data types like uint, bool , address , or string.',
              key: 'B'
            },
            {
              content: 'Array indexing in solidity starts with 0.',
              key: 'C'
            },
            {
              content: '`uint arr[] = new uint[](3)` is a valid array declaration.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b16b49ad-c70d-4c19-a19f-b51521a8f3b0',
          type: 'MultipleChoice',
          content: 'Which of the following statements is correct about enums?',
          hint: 'Enums can have a maximum of 256 members.',
          explanation:
            'The options in enum are represented by subsequent unsigned integer values starting from 0. Using `type(NameOfEnum).min` and `type(NameOfEnum).max` you can get the smallest and respectively largest value of the given enum.',
          answerKeys: ['A', 'C', 'D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: 'They require at least one member, and its default value when declared is the first member.',
              key: 'A'
            },
            {
              content: 'They cannot have more than 128 members.',
              key: 'B'
            },
            {
              content: 'Their options are represented by subsequent unsigned integer values starting from 0.',
              key: 'C'
            },
            {
              content: '`type(NameOfEnum).min` gives the smallest value in the enum.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '663929a6-3a12-43fd-b0ff-ac07c2e34467',
          type: 'SingleChoice',
          content: 'Which of the following is not a reference type?',
          hint: 'noHint',
          explanation: 'enum is a value type.',
          answerKeys: ['D'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'arrays',
              key: 'A'
            },
            {
              content: 'mapping',
              key: 'B'
            },
            {
              content: 'struct',
              key: 'C'
            },
            {
              content: 'enum',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'd118157f-2d86-4ee3-bedc-de508017477a',
          type: 'MultipleChoice',
          content: 'Which of the following is not a valid data location for a reference data type in solidity?',
          hint: 'noHint',
          explanation:
            'address is a value type in solidity whearas memory , storage and calldata are data locations for "reference-types".',
          answerKeys: ['C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'memory',
              key: 'A'
            },
            {
              content: 'storage',
              key: 'B'
            },
            {
              content: 'address',
              key: 'C'
            },
            {
              content: 'calldata',
              key: 'D'
            }
          ]
        },
        {
          uuid: '1e3a6ea0-7b36-4e11-98c5-d4fd9f3e49e1',
          type: 'SingleChoice',
          content: '`uint[][5]` in solidity is -',
          hint: 'two dimensional arrays can be initialized in solidity.',
          explanation:
            'An array of 5 dynamic arrays of uint is written as `uint[][5]`. The notation is reversed compared to some other \nlanguages. In Solidity, X[3] is always an array containing three elements of type X, even if X is itself an array. \nThis is not the case in other languages such as C.\n',
          answerKeys: ['C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: 'Incorrect way to initialize array',
              key: 'A'
            },
            {
              content: 'A dynamic array of 5 arrays',
              key: 'B'
            },
            {
              content: 'An array of 5 dynamic arrays',
              key: 'C'
            },
            {
              content: 'None of the above',
              key: 'D'
            }
          ]
        },
        {
          uuid: '723b95b6-504c-41ff-9b16-22f22756fadd',
          type: 'SingleChoice',
          content: 'Which of the following is the correct way to compare two strings str1 and str2 in solidity?',
          hint: 'noHint',
          explanation:
            'Solidity does not have string manipulation functions, but there are third-party string libraries. You can also \ncompare two strings by their keccak256-hash using  `keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2))` \nand concatenate two strings using `string.concat(s1, s2)`.\n',
          answerKeys: ['B'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`str1 == str2`',
              key: 'A'
            },
            {
              content: '`keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2))`',
              key: 'B'
            },
            {
              content: '`string.concat(s1, s2)`',
              key: 'C'
            },
            {
              content: 'All of above',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b4b39948-5ba0-4791-886f-84ebae031b46',
          type: 'SingleChoice',
          content: 'What does the following syntax do?\n```\n      using SafeMath for uint;\n```\n',
          hint: 'SafeMath is a library and can be imported in solidity.',
          explanation:
            'Arithmetic operations in Solidity wrap on overflow. This can easily result in bugs. Using SafeMath reverts the transaction when an operation overflows.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Imports the SafeMath library',
              key: 'A'
            },
            {
              content: 'Makes uint variable immutable',
              key: 'B'
            },
            {
              content: 'Links SafeMath to uint types',
              key: 'C'
            },
            {
              content: 'Sets the SafeMath variable to an uint',
              key: 'D'
            }
          ]
        },
        {
          uuid: '6d21e243-1d81-4946-8c3d-1e19df119599',
          type: 'SingleChoice',
          content: 'Which of the following is an example of int8?',
          hint: 'What is the range of values int8 can take?',
          explanation: 'int8 can take values from -127 to 128.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Null',
              key: 'A'
            },
            {
              content: '-255',
              key: 'B'
            },
            {
              content: '0',
              key: 'C'
            },
            {
              content: '1000',
              key: 'D'
            }
          ]
        },
        {
          uuid: '9e320266-d211-42d2-9931-c3bc2e7401ac',
          type: 'SingleChoice',
          content: 'Which of the following is an example of a byte value?',
          hint: 'bytes can accept hexadecimal values.',
          explanation:
            'The bytes data type in Solidity is a dynamically sized `byte[]` array and can accept hexadecimal values beginning with 0x.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`0x65`',
              key: 'A'
            },
            {
              content: 'True/False',
              key: 'B'
            },
            {
              content: 'Hello World!',
              key: 'C'
            },
            {
              content: '`[10,20,30]`',
              key: 'D'
            }
          ]
        },
        {
          uuid: '0251f4f5-c96b-4018-b33c-cf570ebfe638',
          type: 'SingleChoice',
          content:
            'What is wrong with the following code ?\n```\n// SPDX-License-Identifier: GPL-3.0\n  pragma solidity >=0.4.16 <0.9.0;\n\n  contract C {\n      function f(uint len) public pure {\n          uint[] memory a = new uint[](7);\n          b[6] = 8;\n          b.push(5);\n  }\n}\n```\n',
          hint: 'noHint',
          explanation:
            'Memory arrays cannot be extended during runtime. The member function push does not exist. If you need to resize your memory array, you need to create a new array with the desired length and copy every element from the old array.',
          answerKeys: ['C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'It is not not possible to declare an array with new keyword',
              key: 'A'
            },
            {
              content: '`b[6]=8` is incorrect assignment for a memory array',
              key: 'B'
            },
            {
              content: 'It is not not possible to use push function with a memory array',
              key: 'C'
            },
            {
              content: 'The code is correct',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'f92bdc52-4d0f-44de-b763-0462f3fe65c7',
          type: 'SingleChoice',
          content:
            'Statement 1- The array literal `[-1,1]` is invalid. \nStatement 2- Calling `push()` member function on an array can be used to append a zero-initialized element at the end of the array.\nWhich of the following options is correct?\n',
          hint: 'noHint',
          explanation:
            'The array literal `[1, -1]` is invalid because the type of the first expression is uint8 while the type of the \nsecond is int8 and they cannot be implicitly converted to each other. To make it work, you can use `[int8(1), -1]`, \nfor example. Methods `.push()` and `.push(value)` can be used to append a new element at the end of the array, \nwhere .push() appends a zero-initialized element and returns a reference to it.\n',
          answerKeys: ['C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Statement 1 is true.',
              key: 'A'
            },
            {
              content: 'Statement 2 is true.',
              key: 'B'
            },
            {
              content: 'Both are true.',
              key: 'C'
            },
            {
              content: 'Neither is true.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '8adbf18e-9fbb-416b-b0a0-b319e642b936',
          type: 'MultipleChoice',
          content: 'Which of the following statements is correct?',
          hint: 'noHint',
          explanation:
            'It is not possible for a struct to contain a member of its own type, although the struct itself can be the value type of a mapping member or it can contain a dynamically-sized array of its type. Struct types can be used inside mappings and arrays and they can themselves contain mappings and arrays.',
          answerKeys: ['B', 'C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'It is possible for a struct to contain a member of its own type.',
              key: 'A'
            },
            {
              content: 'The dot operator is used to access members of a struct.',
              key: 'B'
            },
            {
              content:
                'Struct types can be used inside mappings and arrays and they can themselves contain mappings and arrays.',
              key: 'C'
            },
            {
              content: 'None of these',
              key: 'D'
            }
          ]
        },
        {
          uuid: '49928b3a-750a-42e3-a358-274275fa82a8',
          type: 'SingleChoice',
          content: 'Which of the following statements is correct about mapping data type?',
          hint: 'noHint',
          explanation:
            'Mappings can only have a data location of storage. The KeyType can be any built-in value type, bytes, string, or any contract or enum type. Other user-defined or complex types, such as mappings, structs or array types are not allowed. ValueType can be any type, including mappings, arrays and structs.',
          answerKeys: ['C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content:
                'User-defined or complex types, such as mappings, structs or array types are not allowed as key and "value-types" in a mapping.',
              key: 'A'
            },
            {
              content: 'Mappings can have any data location.',
              key: 'B'
            },
            {
              content: 'All primitive data types are allowed as key and value pairs.',
              key: 'C'
            },
            {
              content: 'All of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '861e7d61-22e2-48db-b6e9-5f95c4b0fbaa',
          type: 'SingleChoice',
          content: 'In the following code snippets where is implicit type conversion possible?',
          hint: 'noHint',
          explanation:
            'In the example below, y and z, the operands of the addition, do not have the same type, but uint8 can be implicitly converted to uint16 and not vice-versa.  uint8 is convertible to uint16 and int128 to int256, but int8 is not convertible to uint256, because uint256 cannot hold values such as -1.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: 'uint8 x; uint16 y; uint32 z=x+y;',
              key: 'A'
            },
            {
              content: 'uint8 x; uint16 y; uint8 z=x+y;',
              key: 'B'
            },
            {
              content: 'int8 x; uint16 y; uint32 z=x+y;',
              key: 'C'
            },
            {
              content: 'Implicit Type conversion is not possible in Solidity.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'e383c36b-6272-4467-ae2e-c69c22ce60bc',
          type: 'SingleChoice',
          content: 'What is the correct declaration for a mapping type ?',
          hint: 'noHint',
          explanation:
            'mapping types use the syntax `mapping(KeyType => ValueType)` and variables of mapping type are declared using \nthe syntax `mapping(KeyType => ValueType)` VariableName`. The KeyType can be any built-in value type, bytes, string, \nor any contract or enum type. Other user-defined or complex types, such as mappings, structs or array types are \nnot allowed. ValueType can be any type, including mappings, arrays and structs.\n',
          answerKeys: ['C'],
          subTopics: ['mapping-type'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`mapping(uint -> address) someMapping;`',
              key: 'A'
            },
            {
              content: '`mapping(struct -> address) someMapping;`',
              key: 'B'
            },
            {
              content: '`mapping (uint => address) someMapping;`',
              key: 'C'
            },
            {
              content: 'None of the above',
              key: 'D'
            }
          ]
        },
        {
          uuid: '63af76dd-2db1-4b0b-bc49-9fa5deb0b6a5',
          type: 'MultipleChoice',
          content: 'Which of the following statements is correct about fixed point numbers?',
          hint: 'noHint',
          explanation:
            'Signed and unsigned fixed point number of various sizes. Keywords ufixedMxN and fixedMxN, where M represents the number of bits taken by the type and N represents how many decimal points are available. M must be divisible by 8 and goes from 8 to 256 bits. N must be between 0 and 80, inclusive. ufixed and fixed are aliases for ufixed128x18 and fixed128x18, respectively.',
          answerKeys: ['A', 'B', 'C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'They can be declared with Keywords `ufixedMxN` and `fixedMxN`.',
              key: 'A'
            },
            {
              content:
                'Fixed point numbers are not fully supported by Solidity yet. They can be declared, but cannot be assigned to or from.',
              key: 'B'
            },
            {
              content:
                'M represents the number of bits taken by the type and N represents how many decimal points are available.',
              key: 'C'
            },
            {
              content: 'M must be divisible by 8 and goes from 2 to 128 bits. N must be between 0 and 16, inclusive.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '794197c0-6a38-49af-a8ce-52c116ee3cee',
          type: 'SingleChoice',
          content: 'Comparison operators like <= , >= are not applicable to which of the following value types?',
          hint: 'noHint',
          explanation:
            " '!' , '&&' , '||' , '==' , '!=' work with booleans. Comparison operators like <=, < etc do not work with booleans in solidity .",
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'bool',
              key: 'A'
            },
            {
              content: 'uint',
              key: 'B'
            },
            {
              content: 'int',
              key: 'C'
            },
            {
              content: 'address',
              key: 'D'
            }
          ]
        },
        {
          uuid: '68640698-1c5f-4afb-8164-fe55360e698a',
          type: 'SingleChoice',
          content:
            'Regarding comparison of strings in solidity , based on the statements below , which of the following options is correct?\nStatement 1 - Compare with the use of hashes. \nStatement 2 - Check by comparing each character including the length check.\n',
          hint: 'Solidity does not have string manipulation functions.',
          explanation:
            'For longer strings it is cost efficient to hash the string and then compare the byte value of the hashes.',
          answerKeys: ['A'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Statement 1 is more gas efficient for longer strings than statement 2.',
              key: 'A'
            },
            {
              content: 'Statement 2 is more gas efficient for longer strings than statement 1.',
              key: 'B'
            },
            {
              content: 'Both statements give almost the same gas cost.',
              key: 'C'
            },
            {
              content: 'There is no gas cost in comparison between strings.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '05680353-3068-486e-ac07-ddc278b06a20',
          type: 'SingleChoice',
          content: 'Which of the following is not a valid address ?',
          hint: 'noHint',
          explanation: 'addresses hold 20 byte hexadecimal values.',
          answerKeys: ['D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9`',
              key: 'A'
            },
            {
              content: '`0x577a6E294505A797976f218eFd751aB5557E1522`',
              key: 'B'
            },
            {
              content: '`0xc0ffee254729296a45a3885639AC7E10F9d54979`',
              key: 'C'
            },
            {
              content: '`0x1011526z3H3fg4445xx556tuoa72288884869aAzl`',
              key: 'D'
            }
          ]
        },
        {
          uuid: '26ca32d3-bc08-41b9-b24a-9cee819a6a34',
          type: 'MultipleChoice',
          content: 'Which of the following is true about address in ethereum and solidity?',
          hint: 'address takes hexadecimal values . what are hexadecimal values?',
          explanation:
            'An address is always prefixed with 0x as it is represented in hexadecimal format (base 16 notation). Numbers 0-9 and alphabets a-f are all valid characters in an ethereum address.',
          answerKeys: ['A', 'B', 'D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'It corresponds to the last 20 bytes of the Keccak-256 hash of the public key.',
              key: 'A'
            },
            {
              content:
                'An address is always prefixed with 0x as it is represented in hexadecimal format (base 16 notation).',
              key: 'B'
            },
            {
              content: 'Numbers 0-9 and alphabets a-z are all valid characters in an ethereum address.',
              key: 'C'
            },
            {
              content: 'The case sensitivity is used for checksum validation.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '8b5b134a-af35-478c-bd53-8ddfb5471646',
          type: 'MultipleChoice',
          content:
            'Which of the following statements is correct about send and transfer functions of the address value type?',
          hint: 'noHint',
          explanation:
            'It is possible to query the balance of an address using the property balance and to send Ether (in units of wei) to a payable address using the transfer function. Send is the low-level counterpart of transfer.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Transfer is the low level counterpart of send.',
              key: 'A'
            },
            {
              content: 'Transfer and send are used to send ether (in units of ETH) to a payable address.',
              key: 'B'
            },
            {
              content: 'In order to make a safe ether transaction it is better to use transfer.',
              key: 'C'
            },
            {
              content: 'None of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '939f30f4-dcfd-4dea-8c48-94e32a0079c5',
          type: 'SingleChoice',
          content:
            'Consider the following statements.\nStatement 1 - code is used to get the EVM bytecode as a byte memory, codehash is used to get the Keccak-256 hash of that code (as a bytes32).\nStatement 2 - `keccak256(address.code)` is cheaper than using `address.codehash`.\nWhich of the following options is correct considering the code and codehash methods of the address type.\n',
          hint: 'noHint',
          explanation:
            'Use .code to get the EVM bytecode as a bytes memory, which might be empty. Use .codehash get the Keccak-256 hash of that code (as a bytes32). Note that addr.codehash is cheaper than using keccak256(addr.code).',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Both Statement 1 and Statement 2 are correct.',
              key: 'A'
            },
            {
              content: 'Statement 1 is correct but Statement 2 is incorrect.',
              key: 'B'
            },
            {
              content: 'Statement 2 is correct but Statement 1 is incorrect.',
              key: 'C'
            },
            {
              content: 'Neither of the statements is correct.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'caa00c9b-61e5-4224-82fa-9a0bb613d436',
          type: 'MultipleChoice',
          content:
            'Which of the following options is correct regarding a user defined value type defined by the syntax `type C is V ;` in solidity.',
          hint: 'noHint',
          explanation:
            'A user defined value type is defined using type C is V, where C is the name of the newly introduced type and V has to be a built-in value type (the “underlying type”). The function C.wrap is used to convert from the underlying type to the custom type. Similarly, the function C.unwrap is used to convert from the custom type to the underlying type.The type C does not have any operators or bound member functions. In particular, even the operator == is not defined. Explicit and implicit conversions to and from other types are disallowed.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'V is the name of the newly introduced data type.',
              key: 'A'
            },
            {
              content:
                'The type V does not have any operators or bound member functions. In particular, even the operator == is not defined.',
              key: 'B'
            },
            {
              content:
                'The function `C.wrap` is used to convert from the underlying type to the custom type. Similarly, the function `C.unwrap` is used to convert from the custom type to the underlying type.',
              key: 'C'
            },
            {
              content: 'None of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b0134cbb-b413-4e42-8030-7221df128b4e',
          type: 'MultipleChoice',
          content: 'In solidity , contract types are -',
          hint: 'noHint',
          explanation: 'Solidity Contracts are like a class in any other object-oriented programming language.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Similar to classes in object oriented languages.',
              key: 'A'
            },
            {
              content: 'Similar to functions in object oriented languages.',
              key: 'B'
            },
            {
              content: 'Reference types.',
              key: 'C'
            },
            {
              content: 'None of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '9c4a6edd-ee00-43f2-a097-05fc166e243b',
          type: 'SingleChoice',
          content: 'Which of the following statements are correct regarding variable declaration in solidity?',
          hint: 'noHint',
          explanation:
            'A variable name should not match with reserved keywords. Variable names must start with a letter or an underscore (_), and may contain letters from “a to z” or “A to Z” or digits from “0 to 9” and characters also. The name of variables are case sensitive.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'A variable name should not match with reserved keywords.',
              key: 'A'
            },
            {
              content: 'Variable names cannot start with underscore.',
              key: 'B'
            },
            {
              content: 'variables are case insensitive , var123 and VAR123 are same variables.',
              key: 'C'
            },
            {
              content: 'none of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '69254f63-d913-4863-a7b2-8398986ccd09',
          type: 'MultipleChoice',
          content: 'Which of the following is correct about contract types in solidity?',
          hint: 'hint',
          explanation: 'explanation',
          answerKeys: ['D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Contracts support comparison operators.',
              key: 'A'
            },
            {
              content:
                'The members of contract types are all the functions of the contract including all state variables.',
              key: 'B'
            },
            {
              content: 'A contract cannot create other contracts using the new keyword.',
              key: 'C'
            },
            {
              content: 'None of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '270dfe5f-a833-472c-ad07-3ce1942780b0',
          type: 'MultipleChoice',
          content: 'Which among the following is  a valid data storage location for mapping type?',
          hint: 'noHint',
          explanation: 'Mappings can only have a data location of storage.',
          answerKeys: ['B'],
          subTopics: ['mapping-type'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'memory',
              key: 'A'
            },
            {
              content: 'storage',
              key: 'B'
            },
            {
              content: 'calldata',
              key: 'C'
            },
            {
              content: 'staticcall',
              key: 'D'
            }
          ]
        },
        {
          uuid: '653b974e-d79d-4103-a2ff-57a86506ada3',
          type: 'MultipleChoice',
          content:
            'The declaration below in solidity is an example of which type? \n   `function f() public payable returns (bytes4){}`\n',
          hint: 'noHint',
          explanation: '`function f() public payable returns (bytes4){}` is a fuction declaration.',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Contract type',
              key: 'A'
            },
            {
              content: 'Function type',
              key: 'B'
            },
            {
              content: 'Reference type',
              key: 'C'
            },
            {
              content: 'Mapping type',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'fec5256b-0f13-49b3-a01f-dd9c40543497',
          type: 'MultipleChoice',
          content:
            'Which access classifier is used with a function type to only access it in the contract it is declared in ?',
          hint: 'private is a subset of internal and external is a subset of public.',
          explanation:
            'public - all can access\nexternal - Cannot be accessed internally, only externally\ninternal - only this contract and contracts deriving from it can access\nprivate - can be accessed only from this contract\n',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'public',
              key: 'A'
            },
            {
              content: 'private',
              key: 'B'
            },
            {
              content: 'internal',
              key: 'C'
            },
            {
              content: 'external',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'b6b96712-83df-49b7-8b54-cab1d3630e3d',
          type: 'MultipleChoice',
          content: 'In the context of memory arrays which of the following statements are true?',
          hint: 'hint',
          explanation:
            'Memory arrays with dynamic length can be created using the new operator. As opposed to storage arrays, it is not possible to resize memory arrays (e.g. the .push member functions are not available). The Solidity Smart Contract can use any amount of memory during the execution but once the execution stops, the Memory is completely wiped off for the next execution.',
          answerKeys: ['A', 'D'],
          subTopics: ['reference-types'],
          difficultyLevel: 'High',
          choices: [
            {
              content: 'they can be declared with the syntax , `uint[] memory a = new uint[](size);`',
              key: 'A'
            },
            {
              content: 'to add an element to the array , `push()` function is used.',
              key: 'B'
            },
            {
              content: 'You can acess values in a memory array after execution of the smart contract.',
              key: 'C'
            },
            {
              content: 'They cost less gas compared to storage arrays.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'bb55a93a-05b2-4ea5-83b4-bd307cdf6c51',
          type: 'MultipleChoice',
          content: '"What will be the value of the following syntax executed in solidity?\n   `255 + (true ? 1 : 0)`\n',
          hint: 'The ternary operator is used in expressions of the form <expression> ? <trueExpression> : <falseExpression>. It evaluates one of the latter two given expressions depending upon the result of the evaluation of the main <expression>. If <expression> evaluates to true, then <trueExpression> will be evaluated, otherwise <falseExpression> is evaluated.',
          explanation:
            'The result type is determined from the types of the two operands in the ternary operator, converting to their mobile type first if required. As a consequence, 255 + (true ? 1 : 0) will revert due to arithmetic overflow. The reason is that (true ? 1 : 0) is of uint8 type, which forces the addition to be performed in uint8 as well, and 256 exceeds the range allowed for this type.',
          answerKeys: ['D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '255',
              key: 'A'
            },
            {
              content: '256',
              key: 'B'
            },
            {
              content: '0',
              key: 'C'
            },
            {
              content: 'the above statement will revert.',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'a2bc4929-787b-4184-959c-480659493663',
          type: 'SingleChoice',
          content:
            'In the following code snippet which line will result in an error-\n  ```\n  // SPDX-License-Identifier: MIT\n  pragma solidity ^0.8.10;\n  contract C {\n\n      //line 1\n      uint public x = 1;\n\n      // line 2\n      function addToX(uint y) public pure returns (uint) {\n          return x + y;\n      }\n\n      // line 3\n      function add(uint i, uint j) public pure returns (uint) {\n          return i + j;\n      }\n  }\n```\n',
          hint: 'Check whether the function declaration is correct.',
          explanation:
            'Pure declares that no state variable will be changed or read in a function. view tells us that by running the function, no data will be saved/changed. Here in line 2 a pure function is trying to read the data from a state variable. The declaration should have a view instead of pure.',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'Line 1',
              key: 'A'
            },
            {
              content: 'Line 2',
              key: 'B'
            },
            {
              content: 'Line 3',
              key: 'C'
            },
            {
              content: 'The code snippet will not give any error',
              key: 'D'
            }
          ]
        },
        {
          uuid: '487d03f1-4e30-447e-86e3-ec74ef4984bc',
          type: 'MultipleChoice',
          content:
            'You have a list of teams and their respective scores in a tournament. You are trying to work up some logic in a contract in solidity to efficiently retrieve the scores . Which of the following data types should you use to keep track of the scores?',
          hint: 'Which data type can be used to store a grouping of data and has greater efficiency when you want to fetch some unique value.',
          explanation:
            "A mapping is a table of keys and values (each with a pre-defined type). Fetching a piece of data from a mapping is far more efficient than fetching the same data from an array. To fetch data from an array requires iterating over the whole array until you find the element you're looking for.",
          answerKeys: ['D'],
          subTopics: ['reference-types', 'mapping-type'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'enum',
              key: 'A'
            },
            {
              content: 'Multi dimensional arrays',
              key: 'B'
            },
            {
              content: 'strings',
              key: 'C'
            },
            {
              content: 'mappings',
              key: 'D'
            }
          ]
        },
        {
          uuid: '4e60aee2-0a82-44f1-a173-17cf88872017',
          type: 'SingleChoice',
          content:
            'On execution of the following code what will be the value of balance?\n```\n   uint8 balance = 255;\n   balance++;\n```\n',
          hint: 'Think of the range of values uint 8 can have .',
          explanation:
            'If you execute the code above the "balance" will be 0. This is a simple example of overflow. If you add 1 to binary 11111111, it resets back to 00000000. In Solidity 0.8, the compiler will automatically take care of checking for overflows and underflows.',
          answerKeys: ['B'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '256',
              key: 'A'
            },
            {
              content: '0',
              key: 'B'
            },
            {
              content: '255',
              key: 'C'
            },
            {
              content: '-255',
              key: 'D'
            }
          ]
        },
        {
          uuid: 'd9e1ab62-0af2-457b-b770-d21dc954b76d',
          type: 'MultipleChoice',
          content:
            'Which of the following statements are correct in the context of storage and memory data locations ?',
          hint: 'Think of how storage and memory affects the gas cost and how the code can be optimized.',
          explanation:
            'Every transaction on Ethereum Virtual Machine costs us some amount of Gas. The lower the Gas consumption the better is your Solidity code. The Gas consumption of Memory is not very significant as compared to the gas consumption of Storage. Therefore, it is always better to use Memory for intermediate calculations and store the final result in Storage.',
          answerKeys: ['A', 'B', 'C'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Hard',
          choices: [
            {
              content: 'Memory in solidity is a temporary storage.',
              key: 'A'
            },
            {
              content: 'Storage is persistent and holds data between function calls.',
              key: 'B'
            },
            {
              content:
                'State variables and Local Variables of structs, array are always stored in storage by default. Function arguments are in memory.',
              key: 'C'
            },
            {
              content: 'None of these.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '94432d54-9f7c-4b53-be49-314a4aa94d5a',
          type: 'SingleChoice',
          content:
            'Look at the code snippet below,\n```\n           pragma solidity ^0.5.0;\n           contract SolidityTest {\n             uint storedData;     \n             constructor() public {\n                 storedData = 10;   \n             }\n           }\n```\nWhat type of variable is storedData declared in the SolidityTest contract?"\n',
          hint: 'noHint',
          explanation:
            'State Variables , Variables whose values are permanently stored in a contract storage.\nLocal Variables , Variables whose values are present till function is executing.\nGlobal Variables , Special variables which exist in the global namespace used to get information about the blockchain.\n',
          answerKeys: ['A'],
          subTopics: ['reference-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: 'State Variables',
              key: 'A'
            },
            {
              content: 'Local Variables',
              key: 'B'
            },
            {
              content: 'global Variables',
              key: 'C'
            },
            {
              content: 'None of these',
              key: 'D'
            }
          ]
        },
        {
          uuid: '6b728a07-8caf-47d0-b62d-2e97c5b2ff32',
          type: 'MultipeChoice',
          content: 'Which of the following is a valid enum declaration in solidity?',
          hint: 'there must be atleast one option in enum.',
          explanation:
            'you cant use numbers (positive or negative) or boolean (true or false in lowercase) as members for an enum. However, True and False (Capitalized) are accepted.',
          answerKeys: ['B', 'D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: '`enum integers {  1 , 2 , 3 , 4 }`',
              key: 'A'
            },
            {
              content: '`enum values { one , two , three }`',
              key: 'B'
            },
            {
              content: '`enum myEnums { }`',
              key: 'C'
            },
            {
              content: '`enum booleans { True , False }`',
              key: 'D'
            }
          ]
        },
        {
          uuid: '3648ad26-bb00-458d-afaa-0762e70a5dbe',
          type: 'SingleChoice',
          content:
            'Consider the following code snippet ,\n```\n              pragma solidity ^0.5.0;\n              contractC {\n                function foo(uint a) pure public returns (uint){\n                  return a << 2;\n                }\n              }\n```\nWhat will be the output when a uint value 3 is passed in the function foo of the contract C?"\n',
          hint: 'The Left Shift operator (<<) moves all the bits in its first operand to the left by the number of places specified in the second operand.',
          explanation: 'x << y is equivalent to the mathematical expression x * 2**y.',
          answerKeys: ['D'],
          subTopics: ['value-types'],
          difficultyLevel: 'Hard',
          choices: [
            {
              content: '0',
              key: 'A'
            },
            {
              content: '1',
              key: 'B'
            },
            {
              content: '8',
              key: 'C'
            },
            {
              content: '12',
              key: 'D'
            }
          ]
        },
        {
          uuid: '203d97e1-7194-4373-b943-d89d06e35126',
          type: 'MultipleChoice',
          content: 'Which of the following are valid literals for solidity data types?',
          hint: 'noHint',
          explanation:
            '2.5e1 is an integer literal , "foo" "bar" is equivalent to “foobar” which is a string literal and hex"001122FF" is an example of  hexadecimal literal which are prefixed with the keyword hex.',
          answerKeys: ['A', 'B', 'C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Low',
          choices: [
            {
              content: '`2.5e1`',
              key: 'A'
            },
            {
              content: " `'foo' 'bar'` ",
              key: 'B'
            },
            {
              content: '`hex"001122FF"`',
              key: 'C'
            },
            {
              content: 'None of these',
              key: 'D'
            }
          ]
        },
        {
          uuid: '2bb12876-aee8-4cbd-8662-e193bb5503aa',
          type: 'SingleChoice',
          content:
            'Variable packing is one way solidity optimizes gas costs in storage state variables . Consider the following two examples of variable declarations.\nExample 1 -\n  ```\n         uint128 a;\n         uint256 b;\n         uint128 c;\n  ```\nExample 2 -\n  ```\n         uint128 a;\n         uint128 c;\n         uint256 b;\n  ```\nWhich of the following statements are correct regarding variable packing in the above examples."\n',
          hint: 'Solidity contracts have contiguous 32 byte (256 bit) slots used for storage.',
          explanation:
            'In example 1 the variables are not packed. If b was packed with a, it would exceed the 32 byte limit so it is instead placed in a new storage slot. The same thing happens with c and b. In example 2 the  variables are packed. Because packing c with a does not exceed the 32 byte limit, they are stored in the same slot.',
          answerKeys: ['C'],
          subTopics: ['value-types'],
          difficultyLevel: 'Hard',
          choices: [
            {
              content: 'Variables in both examples 1 and 2 are packed.',
              key: 'A'
            },
            {
              content: 'Variables in example 1 are packed but not in example 2.',
              key: 'B'
            },
            {
              content: 'Variables in example 2 are packed but not in example 1.',
              key: 'C'
            },
            {
              content: 'Variables in neither examples 1 and 2 are packed.',
              key: 'D'
            }
          ]
        },
        {
          uuid: '47e3f7e4-b2e6-4c0f-acd7-e7c960203710',
          type: 'SingleChoice',
          content:
            'Consider the following code snippet ,\n  ```\n  // SPDX-License-Identifier: GPL-3.0\n  pragma solidity ^0.8.8;\n  contract test {\n    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }\n\n    function foo() public pure returns (ActionChoices) {\n        return type(ActionChoices).max;\n    }\n  }\n  ```\nWhat will be the output when the function foo is called?\n',
          hint: '.max is used to get the largest value of the given enum.',
          explanation:
            'Under the hood, enums are integers, not strings. Solidity will automatically handle converting enums to ints.',
          answerKeys: ['A'],
          subTopics: ['value-types'],
          difficultyLevel: 'Medium',
          choices: [
            {
              content: '`0:uint8: 3`',
              key: 'A'
            },
            {
              content: '`0:uint8: 0`',
              key: 'B'
            },
            {
              content: '`0:string: “SitStill”`',
              key: 'C'
            },
            {
              content: '`0:string: “GoLeft”`',
              key: 'D'
            }
          ]
        }
      ],
      readings: [
        {
          uuid: 'a150cd2d-1888-4210-8bee-9411eb25e3bf',
          title: 'Introduction to Solidity Data types',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=N1Jeeei_wtw',
          subTopics: ['value-types', 'reference-types', 'mapping-type'],
          details:
            "In this video we're looking at the data types available in Solidity.\nThis video explains about the use of -\n* Value Types - Integers , Booleans etc \n* Reference Types - Structs , Arrays .\n* Mapping Type - Mapping.\n"
        },
        {
          uuid: 'ee869939-2186-42bb-a8a0-de3fd366862e',
          title: 'Solidity Tutorial - Variable Types',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=TNZLonjrLYE',
          subTopics: ['value-types', 'reference-types', 'mapping-type'],
          details:
            'In this video we are looking at an overview of all the variable types in Solidity and how to declare them.\nThis video explains about all the variables that can be declared using types : \n* uint\n* bytes32\n* string\n* bytes\n* arrays\n* mappings\n* structs\n* enums\n'
        },
        {
          uuid: '747a3dca-1ba1-421e-adc0-b75f32b5ae99',
          title: 'Master Solidity Variables, Data Types, and Structs Master Solidity',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=HxlxNwgoN8w',
          subTopics: ['value-types', 'reference-types', 'mapping-type'],
          details:
            'In this video we are looking at different solidity types and variables.\nThis video explains all the different variables that can be declared (state variables and Local Variables).\n'
        },
        {
          uuid: 'cb6cf918-b9ac-4c65-8506-f5a0bb3564bf',
          title: 'Solidity Tutorial, Arrays (Declare, Read, Update, Delete).',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=MPBOnChpi0c&list=PLbbtODcOYIoE0D6fschNU4rqtGFRpk3ea&index=14',
          subTopics: ['reference-types'],
          details:
            'This video explains how to - \n- Declare arrays\n- Add elements\n- Read elements\n- Update elements\n- Delete elements\n- Iterate through elements\nThis video further explores the differences between-\n- Fixed-size and Dynamic size\n- Storage and memory arrays\nand it also covers how to accept arrays argument in Solidity functions and return arrays from solidity functions.\n'
        },
        {
          uuid: 'f936c72d-9d71-4c05-bf38-3b827b0d95f5',
          title: 'Solidity Tutorial: Mappings (simple mappings, nested mappings, array in mappings...)',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=U-wWqTq1zoQ&list=PLbbtODcOYIoE0D6fschNU4rqtGFRpk3ea&index=15',
          subTopics: ['mapping-type'],
          details:
            'This video explains how to declare and manipulate mappings in Solidity. It also covers simple mappings but also advanced mappings like nested mappings and array inside mappings. \n'
        },
        {
          uuid: '7834704f-0749-4457-bd5b-7531ea34ff99',
          title: 'Solidity Tutorial, Arrays (Declare, Read, Update, Delete).',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=UkdU0cuAp9U&list=PLbbtODcOYIoE0D6fschNU4rqtGFRpk3ea&index=16',
          subTopics: ['reference-types'],
          details:
            'Solidity Structs allow you to represent structured data. This video explains how to declare, instantiate (create), read, update and delete structs in Solidity.\nIt will also show some more advanced struct manipulation like how to declare an array of structs and how to declare a mapping of structs.\n'
        },
        {
          uuid: '83565016-2bf9-4b07-a0a3-938cbe86749f',
          title: 'Solidity Tutorial, Arrays (Declare, Read, Update, Delete).',
          type: 'YoutubeVideo',
          url: 'https://www.youtube.com/watch?v=5ED_6FasZ68&list=PLbbtODcOYIoE0D6fschNU4rqtGFRpk3ea&index=17',
          subTopics: ['reference-types'],
          details:
            'Solidity Enums allow you to represent optional data.\nThis video covers how to declare enums, use enums, accept enums as argument in solidity functions.\n'
        }
      ],
      summaries: [
        {
          title: 'Value Types',
          key: 'value-types',
          details:
            'The following types are called value types because variables of these types will always be passed by value, i.e. they are always copied when used in function arguments or asssignments.\n- Booleans\n  * They are declared using the keyword `bool`.\n  * The possible values are constants true and false.\n\n- Integers\n  * They are declared using keywords `int` , `uint` for signed and unsigned integers.\n  * Keywords `uint8` to `uint256` in steps of 8 are used to store unsigned integers with varying sizes in bits. Similarly , `int8` to `int256` for signed integers.\n  * For Example, uint32 is a 32 bit unsigned integer having range from 0 to $2^{32}-1$ whearas int32 is a 32 bit signed integer having range from $-2^{31}$ to $2^{31}-1$.\n  * For an integer type X, you can use `type(X).min` and `type(X).max` to access the minimum and maximum value representable by the type.\n  * Integers allow the use of comparision (<=, <, ==, !=, >=, >) , bit (&, |, ^ , ~) , arithmetic (+, -, *, /, %, ** ) and shift (<< , >>) operators.\n  * `x << y` is equivalent to the mathematical expression $x * 2^y$. `x >> y` is equivalent to the mathematical expression $x / 2^y$.\n\n- Fixed Point Numbers\n  * They are declared using keywords `fixed` , `ufixed`.\n  * Keywords ufixedMxN and fixedMxN, where M represents the number of bits taken by the type and N represents how many decimal points are available. M must be divisible by 8 and goes from 8 to 256 bits. N must be between 0 and 80, inclusive.\n  * Fixed point numbers are not fully supported by Solidity yet. They can be declared, but cannot be assigned to or from.\n\n- Addresses\n  * They can be declared using keywords `address` and `address payable`.\n  * address type hold a 20 byte value (size of an Ethereum address).\n  * address payable is same as address, but with the additional members transfer and send.\n  * address payable is an address you can send Ether to.\n  * Implicit conversions from `address payable` to `address` are allowed, whereas conversions from address to address payable must be explicit via` payable(<address>)`.\n  * It is possible to query the balance of an address using the property `balance` and to send Ether (in units of wei) to a payable address using the `transfer` function.\n  * `send` is the low-level counterpart of `transfer`.\n\n- Contract types\n  * Every contract defines its own type.\n  * You can implicitly convert contracts to contracts they inherit from.\n\n- Enums\n  * Enums are used create a user-defined type in Solidity.\n  * Enums restrict the variable with one of a few predefined values, these values of the enumerated list are called enums.\n  * Syntax to declare an enum is `enum <enumerator_name> {element 1, element 2,....,element n}`\n  * Enums require at least one member, and its default value when declared is the first member.\n  * Enums cannot have more than 256 members.\n  * The options in an enum are represented by subsequent unsigned integer values starting from 0.\n\n- User Defined Value Types\n  * A user defined value type is defined using `type C is V`, where C is the name of the newly introduced type and V has to be a built-in value type (the “underlying type”). \n  * The function C.wrap is used to convert from the underlying type to the custom type.\n  * The function C.unwrap is used to convert from the custom type to the underlying type.\n  * The type C does not have any operators or bound member functions. \n\n- Function Types \n  * Function types are the types of functions.\n  * Function types are declared as `function (<parameter types>) {internal|external} [pure|view|payable] [returns (<return types>)]`.\n  * Internal functions can only be called inside the current contract.\n  * External functions consist of an address and a function signature and they can be passed via and returned from external function calls.\n  * View functions are read only function and do not modify the state of the block chain (view data on the block chain).\n  * Pure functions do not read and do not modify state of the block chain.   \n'
        },
        {
          title: 'Reference Types',
          key: 'reference-types',
          details:
            'Values of reference type can be modified through multiple different names in contrast to value types where an independent copy is maintained whenever a variable of value type is used.\nWhile using a reference type a data location(where the variable is stored) has to be provided explicitly. Currently, reference types comprise of structs, arrays and mappings.\n- Data location\n   * There are three data locations: memory, storage and calldata.\n   * When placed in storage, a variable is written on the blockchain. Every contract has its own storage, so these variables are persistent. \n   * Variables stored in memory are declared inside a function. They are temporary and their lifetime is dependent on the runtime of the function they correspond to.\n   * Calldata is also a temporary data location in Solidity. It acts like memory, in terms of its dependence on the functions execution.\n   * Storage is the most expensive data location one can use. Then there is memory, with the cheapest being calldata.\n \n - arrays\n   * Arrays can have a compile-time fixed size, or they can have a dynamic size.\n   * `type arrayName [ arraySize ];` declares an array of fixed size in Solidity.\n   * `type[] arrayName;` declares an array of dynamic size in solidity.\n   * Memory arrays with dynamic length can be created using the new operator eg `uint[] memory a = new uint[](7);` . As opposed to storage arrays, it is not possible to resize memory arrays.\n \n - bytes and strings as arrays\n   * Variables of type bytes and string are special arrays.\n   * The bytes type is similar to bytes1[], but it is packed tightly in calldata and memory. \n   * string is equal to bytes but does not allow length or index access.\n   * Solidity does not have string manipulation functions, but there are third-party string libraries.\n   * You can compare two strings by their keccak256-hash using `keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2))` and concatenate two strings using `string.concat(s1, s2)`.\n\n - structs\n   * Structs in Solidity are used to create more complicated data types that have multiple properties.\n   * They are useful for grouping together related data.\n   * Syntax to declare a struct is -\n     ```\n       struct <structure_name> {  \n         <data type> variable_1;  \n         <data type> variable_2; \n       }\n     ```\n   * For accessing any element of the structure the dot operator is used.  \n'
        },
        {
          title: 'Mapping Type',
          key: 'mapping-type',
          details:
            'Mapping in Solidity acts like a hash table or a dictionary. These are used to store the data in the form of key-value pairs.\n- Mapping types use the syntax `mapping(KeyType => ValueType)` and variables of mapping type are declared using the syntax `mapping(KeyType => ValueType) VariableName`.\n- The KeyType can be any built-in value type, bytes, string, or any contract or enum type. Other user-defined or complex types, such as mappings, structs or array types are not allowed.\n- ValueType can be any type, including mappings, arrays and structs.\n- Mappings can only have a data location of storage.\n'
        }
      ]
    }
  ]
};
course.topics.push(cloneDeep(course.topics[0]));
course.topics[1].key= "second-topic",
course.topics[1].title = 'second topic'
console.log(1234, course)
</script>

<template>
  <div class="mt-4 container-default">
    <Block slim :title="course.title">
      <div class="flex flex-col md:flex-row">
        <div class="nav-wrapper my-4">
          <CourseNavigation :course="course"></CourseNavigation>
        </div>
        <div class="flex-1 ml-4 my-4">
          <router-view v-if="course" :course="course" />
        </div>
      </div>
    </Block>
  </div>
</template>
<style lang="scss" scoped>
.nav-wrapper {
  width: 100%;
  @screen md {
    max-width: 300px;
  }
}
</style>
