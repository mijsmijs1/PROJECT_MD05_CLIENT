import authenApi from './authen'
import userApi from './user'
import memberApi from './member'
import categoryApi from './category'
import walletApi from './wallet'
import './axios.instance'
import receiptApi from './receipt'
import productApi from './product'
import branchApi from './branches'
export const api = {
    authen: authenApi,
    user: userApi,
    member: memberApi,
    category: categoryApi,
    wallet: walletApi,
    receipt: receiptApi,
    product: productApi,
    branch: branchApi
}