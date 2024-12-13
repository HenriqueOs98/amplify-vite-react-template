import React from 'react'

const Tutorial1 = () => {
  return (
    <div className="space-y-6">
      <h2 className="font-orbitron text-2xl">01. Setting Up</h2>
      <h3 className="font-orbitron text-xl text-primary"># What is JavaScript?</h3>
      <p className="mt-4">Welcome to The Origins III: JavaScript! Things are about to get fun. ✨</p>
      <p>
        The programming language we&apos;re learning is called{" "}
        <span className="text-primary">JavaScript</span> and it powers{" "}
        <span className="text-primary">97.5%</span> of websites today.
      </p>
      <div className="flex items-center space-x-2">
        <span className="text-muted-foreground">🔥</span>
        <span>HTML</span>
        <span>+</span>
        <span className="text-muted-foreground">💧</span>
        <span>CSS</span>
        <span>+</span>
        <span className="text-muted-foreground">⚡</span>
        <span>JavaScript</span>
        <span>=</span>
        <span>core languages of the web.</span>
      </div>
      <p>
        HTML and CSS give a website structure and styling, but JavaScript makes it interactive and{" "}
        <em>come alive</em>. It lets us add basic functionality and dynamic behaviors to our web pages.
      </p>
      <p>But how did it come to be?</p>
      <div className="my-8">
        <img src="/placeholder.svg" alt="Rocket illustration" className="w-32 invert" />
      </div>
      <p>
        The 90s was the dawn of the dot-com era, and an internet browser war was brewing between
        Netscape and Microsoft. In 1995, a Netscape developer created a buggy new scripting
        language... in just 10 days. 😅
      </p>
      <p>Take this clickable button, for example:</p>
      {/* Add more content here to ensure scrolling */}
      {[...Array(10)].map((_, i) => (
        <p key={i}>This is additional content to demonstrate scrolling. Line {i + 1}</p>
      ))}
    </div>
  )
}

export default Tutorial1

