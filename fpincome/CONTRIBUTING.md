In an attempt to keep the git history clean, maintainable and
easy to access for all contributors, a strict commit policy has
been implemented.

Please use the following guidelines to format all your commit  
messages:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>

Please note that:

- The HEADER is a single line of max. 50 characters that  
  contains a succinct description of the change. It contains a  
  type, an optional scope, and a subject

  - <type> describes the kind of change that this commit is
    providing. Allowed types are:

    - feat (feature)
    - fix (bug fix)
    - docs (documentation)
    - style (formatting, missing semicolons, ...)
    - refactor
    - test (when adding missing tests)
    - chore (maintain)

  - <scope> can be anything specifying the place of the commit  
     change
  - <subject> is a very short description of the change

- The BODY should include the motivation for the change and  
  contrast this with previous behavior and must be phrased in  
  imperative present tense
- The FOOTER should contain any information about Breaking  
  Changes and is also the place to reference GitHub issues that  
  this commit closes
