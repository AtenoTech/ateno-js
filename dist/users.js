export class Users {

  constructor(client) {
    this.client = client
  }

  async getUser() {
    return this.client.request("/user")
  }

  async getUserById(id) {
    return this.client.request(`/users/${id}`)
  }

}

export default Users