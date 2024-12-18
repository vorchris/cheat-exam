// import { Extension, textInputRule } from '@tiptap/core'

// export const CharReplacer = (options) => {
//   return Extension.create({
//     name: 'charReplacer',

//     addInputRules() {
//       if (options.language === "de-DE") {
//         return [
//           textInputRule({ find: /(^|(?<=\s))"(?=\s|$|\w)/g, replace: '„' }),   ///(^|(?<=\s))"(?=\s|$|\w)(?!(?<=\w)\s*[:{}])/g     // anderer regex um "attribut":"value"  oder { let variable = "string"; }  zu erlauben
//           textInputRule({ find: /"(?=\s|$)/g, replace: '“' })
//         ];
//       }
//       return [];
//     },
//   })
// }




import { Extension, InputRule } from '@tiptap/core';


















let inputRuleHandled = false;

export const CharReplacer = (options) => {
  return Extension.create({
    name: 'charReplacer',

    addKeyboardShortcuts() {
      return {
        Backspace: ({ editor }) => {
          const { state, view } = editor;
          const { $from } = state.selection;


          console.log('Lösche deutsches Anführungszeichen');
          view.dispatch(state.tr.delete($from.pos - 1, $from.pos));
          inputRuleHandled = false; // InputRules wieder aktivieren
          return true; // Verhindere Standard-Backspace-Verhalten
          

         
        },
      };
    },

    addInputRules() {
      if (options.language === 'de-DE') {
        return [
          // Regel für öffnende Anführungszeichen
          new InputRule({
            find: /(^|(?<=\s))"(?=\s|$|\w)/g,
            handler: ({ state, range }) => {
              console.log('Ersetze mit deutschem öffnenden Anführungszeichen');
              const { from, to } = range;
              state.tr.insertText('„', from, to);
              inputRuleHandled = true; // Verhindere doppelte Verarbeitung
            },
          }),

          // Regel für schließende Anführungszeichen
          new InputRule({
            //find: /"(?=\s|$)/g,
            find: /"/g,
            handler: ({ state, range }) => {
              const charBefore = state.doc.textBetween(range.from - 1, range.from, '');
              
              // Prüfe, ob das Zeichen vor dem `"` ein erlaubter Kontext ist
              if (charBefore === '„' || /\w|\s/.test(charBefore)) {
                console.log('Ersetze mit deutschem schließendem Anführungszeichen');
                const { from, to } = range;
                state.tr.insertText('“', from, to);
              } else {
                const { from, to } = range;
                state.tr.insertText('“', from, to);
              }
            },
          }),

          // Regel für allgemeine englische Anführungszeichen
          new InputRule({
            find: /"/g,
            handler: ({ state, range }) => {
              console.log('!!!!!!!!!: Englisches Anführungszeichen gefunden');
              const { from, to } = range;
              // Überschreibe das Zeichen explizit
              state.tr.insertText('"', from, to);
            },
          }),
        ];
      }
      return [];
    },
  });
};
