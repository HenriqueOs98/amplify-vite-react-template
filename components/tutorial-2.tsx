import React from 'react'

const Tutorial2 = () => {
  return (
    <div className="space-y-6">
      <h2 className="font-orbitron text-2xl">02. Variables and Data Types</h2>
      <h3 className="font-orbitron text-xl text-primary"># Understanding Variables</h3>
      <p>
        In JavaScript, variables are containers for storing data values. Think of them as labeled boxes where you can put different types of information.
      </p>
      <p>
        To declare a variable, you can use the <code>let</code>, <code>const</code>, or <code>var</code> keyword (though <code>var</code> is less commonly used in modern JavaScript).
      </p>
      <pre className="bg-muted p-4 rounded-md">
        <code>
          {`let age = 25;
const name = "Alice";
var isStudent = true;`}
        </code>
      </pre>
      <h3 className="font-orbitron text-xl text-primary"># Common Data Types</h3>
      <p>JavaScript has several basic data types:</p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Number:</strong> Represents both integer and floating-point numbers</li>
        <li><strong>String:</strong> Represents textual data</li>
        <li><strong>Boolean:</strong> Represents true or false</li>
        <li><strong>Undefined:</strong> Represents a variable that has been declared but not assigned a value</li>
        <li><strong>Null:</strong> Represents a deliberate non-value or absence of any object value</li>
      </ul>
      <p>
        Understanding these basic concepts is crucial as you begin your JavaScript journey. In the next lesson, we'll explore how to work with these data types and perform operations on them.
      </p>
    </div>
  )
}

export default Tutorial2

