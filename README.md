# Personal Finances

This is not a particularly interesting project, at least not for anybody other than me, but then again...
What do I know?

This is a simple Node library for keeping track of financial transactions.

I made this library to help myself...
* ...learn Typescript (I previously used my own VB.NET/C# application for keeping track of my personal finances and
  it worked well for a long time but eventually I just got tired of maintaining it).
* ...keep my personal finances private (there are a number of companies offering much better solutions than this but I
  simply do not want to share my financial data with more companies/services than absolutely necessary).
* ...separate application logic from presentation (I don't want to mix the core functionality with the GUI).
* ...learn about NPM package management.

## Development

## Requirements

* `node`
* `yarn`

### Running tests

    $ yarn
    $ yarn watch
    $ yarn test
    
# Publish Packages

Prerequisites:

    $ npm login --registry=https://npm.pkg.github.com --scope=@mikaelsvensson

$ cat ~/.npmrc

Publish: 
    
    $ yarn publish

Check out https://github.com/mikaelsvensson/personal-finances-core/packages for list of published package versions.
