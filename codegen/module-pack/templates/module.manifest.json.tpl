{
  "module": "{{moduleKebab}}",
  "moduleLabel": "{{moduleLabel}}",
  "generatedAt": "{{generatedAt}}",
  "mode": "module-first-full-template",
  "template": "CRUD",
  "outputMode": "reviewable-zip-only",
  "notes": [
    "all files from template pack",
    "resource types, validators, permission map, service, protected API route, frontend API/form/list, app bridge, tests and review snippets",
    "generated output is reviewable only; it never requests server-side arbitrary directory writes",
    "same-process callers use the generated Service as a local application port",
    "cross-domain callers must use createDomainFacade / broker.call; split-process uses the same methods over RPC"
  ]
}
