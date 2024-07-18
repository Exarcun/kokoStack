declare module 'apollo-upload-client' {
     export class ReactNativeFile {
       constructor({ uri, name, type }: { uri: string; name: string; type: string });
     }
   }
   