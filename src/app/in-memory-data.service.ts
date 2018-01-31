import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const auth = [
      { token: "12345", status: "200"}
    ];
    return {auth};
  }
}
