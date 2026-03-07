import AtenoClient from "./client.js"
import Users from "./users.js"

class Ateno {
  constructor(apiKey, options = {}) {
    this.client = new AtenoClient(apiKey, options)
    this.users = new Users(this.client)
  }
}

Ateno.Ateno = Ateno
Ateno.AtenoClient = AtenoClient
Ateno.Users = Users

export { Ateno, AtenoClient, Users }
export default Ateno