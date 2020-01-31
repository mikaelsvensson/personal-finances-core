class RealAccount {
  constructor(
    public name: string,
    public financialInstitution: string,
    public accountNumber: string,
    public sourceReference: string | null,
    public id: string | null
  ) {
  }
}

export default RealAccount
