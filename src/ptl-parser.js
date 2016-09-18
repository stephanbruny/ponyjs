(function(root){

  if (!root.Pony) {
    throw new Error("PTL-Parser cannot be used without Pony.JS core");
  }

  /**
   * PTLParser Constructor
   * 
   * @param text    The string/text to be parsed
   * @param context Object with additional template data
   */
  function PTLParser(text, context) {
    this.text = text;
    this.context = context || {};
    
    this.syntax = {
      identifier: /[a-zA-Z][a-zA-Z0-9_\-]*/,
      objectPrefix: /\@/,
      variablePrefix: /\$/,
      objectBegin: /\{/,
      objectEnd: /\}/,
      typePrefix: /\:/,
      string: /\"(.+)\"|\'(.+)\'/,
      number: /[1-9][0-9]*|[0-9]\.[0-9]+/
    }
  }

  PTLParser.prototype.parse = function(text) {
    var subject = text || this.text;
    
  }

})(this);