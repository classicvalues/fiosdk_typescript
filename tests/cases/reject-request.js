const { expect } = require('chai')
const { EndPoint } = require('../../lib/entities/EndPoint')
const { Constants } = require('../../lib/utils/constants')

const rejectRequest = ({
  testFioAddressName,
  testFioAddressName2,
  fioChainCode,
  fioTokenCode,
  defaultFee,
  timeout
}) => {
  const fundsAmount = 4
  let requestId
  const memo = 'testing fund request'

  it(`requestFunds`, async () => {
    const result = await fioSdk2.pushTransaction(Constants.actionNames.newfundsreq, {
      payer_fio_address: testFioAddressName,
      payee_fio_address: testFioAddressName2,
      max_fee: defaultFee,
      content: {
        payer_fio_public_key: fioSdk.publicKey,
        payee_public_address: fioSdk2.publicKey,
        amount: `${fundsAmount}`,
        chain_code: fioChainCode,
        token_code: fioTokenCode,
        memo,
        hash: '',
        offline_url: '',
      }
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })

    requestId = result.fio_request_id
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected')
    expect(result.fio_request_id).to.be.a('number')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })

  it(`getPendingFioRequests`, async () => {
    await timeout(4000)
    const result = await fioSdk.get(EndPoint.pendingFioRequests, {
      fio_public_key: fioSdk.publicKey
    })

    expect(result).to.have.all.keys('requests', 'more')
    expect(result.requests).to.be.a('array')
    expect(result.more).to.be.a('number')
    const pendingReq = result.requests.find(pr => parseInt(pr.fio_request_id) === parseInt(requestId))
    expect(pendingReq).to.have.all.keys('fio_request_id', 'payer_fio_address', 'payee_fio_address', 'payee_fio_public_key', 'payer_fio_public_key', 'time_stamp', 'content')
    expect(pendingReq.fio_request_id).to.be.a('number')
    expect(pendingReq.fio_request_id).to.equal(requestId)
    expect(pendingReq.payer_fio_address).to.be.a('string')
    expect(pendingReq.payer_fio_address).to.equal(testFioAddressName)
    expect(pendingReq.payee_fio_address).to.be.a('string')
    expect(pendingReq.payee_fio_address).to.equal(testFioAddressName2)
  })

  it(`getFee for rejectFundsRequest`, async () => {
    const result = await fioSdk.getFee(EndPoint.rejectFundsRequest, testFioAddressName2) // payerFioAddress

    expect(result).to.have.all.keys('fee')
    expect(result.fee).to.be.a('number')
  })

  it(`rejectFundsRequest`, async () => {
    const result = await fioSdk.pushTransaction(Constants.actionNames.rejectfndreq, {
      fio_request_id: requestId,
      max_fee: defaultFee,
    }, {
      account: Constants.abiAccounts.fio_reqobt
    })

    expect(result).to.have.all.keys('status', 'fee_collected')
    expect(result.status).to.be.a('string')
    expect(result.fee_collected).to.be.a('number')
  })
}

module.exports = {
  rejectRequest
}