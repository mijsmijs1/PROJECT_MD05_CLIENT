import React from 'react'
import './footer.scss'
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
    <div className="footer">
      <div className='footer_content'>
        <div>
          <p>{t('footer.Customersupport')}</p>
          <ul>
            <li>
              <a>{t('footer.DiscountCards')}</a>
            </li>
            <li>
              <a>{t('footer.OnlineShoppingGuide')}</a>
            </li>
            <li>
              <a>{t('footer.BusinessOffers')}</a>
            </li>
            <li>
              <a>{t('footer.InstallmentPolicy')}</a>
            </li>
            <li>
              <a>{t('footer.RepairServices')}</a>
            </li>
          </ul>
        </div>
        <div>
          <p>{t('footer.PurchasePolicy')}</p>
          <ul>
            <li>
              <a>{t('footer.PurchasePolicy')}</a>
            </li>
            <li>
              <a>{t('footer.WarrantyPolicy')}</a>
            </li>
            <li>
              <a>{t('footer.ReturnPolicy')}</a>
            </li>
            <li>
              <a>{t('footer.PaymentPolicy')}</a>
            </li>
            <li>
              <a>{t('footer.HomeDeliveryAndInstallation')}</a>
            </li>
            <li>
              <a>{t('footer.PCAndLaptopInstallationAndUpgradeServices')}</a>
            </li>
          </ul>
        </div>
        <div>
          <p>{t('footer.AboutPhuQuy')}</p>
          <ul>
            <li>
              <a>{t('footer.AboutPhuQuy')}</a>
            </li>
            <li>
              <a>{t('footer.StoreLocations')}</a>
            </li>
            <li>
              <a>{t('footer.ServiceCenter')}</a>
            </li>
            <li>
              <a>{t('footer.PrivacyPolicy')}</a>
            </li>
            <li>
              <a>{t('footer.TechnologyNews')}</a>
            </li>
          </ul>
        </div>
        <div>
          <p>{t('footer.CommunityPhuQuy')}</p>
          <ul>
            <li>{t('footer.CallToPurchase')} <a href="tel:18006867">18006867</a></li>
            <li>{t('footer.CustomerCare')} <a href="tel:18006867">18006867</a></li>
            <li>{t('footer.FacebookPhuQuy')} <a href="https://www.facebook.com/phuquy.com.vn" target="_blank" rel="noopener noreferrer">facebook.com/phuquy.com.vn</a></li>
            <li>{t('footer.PhuQuyMedia')} <a href="https://media.phuquy.com.vn" target="_blank" rel="noopener noreferrer">media.phuquy.com.vn</a></li>
            <li>{t('footer.ZaloPhuQuy')} <a href="https://zalo.me/18006867" target="_blank" rel="noopener noreferrer">zalo.me/18006867</a></li>
            <li>{t('footer.CustomerSupportEmail')} <a href="mailto:hotro@phuquy.com.vn">hotro@phuquy.com.vn</a></li>
            <li>{t('footer.QuoteInquiryContact')} <a href="mailto:dautu@phuquy.com.vn">dautu@phuquy.com.vn</a></li>
            <li>{t('footer.DevelopmentCooperation')}</li>
          </ul>
        </div>
      </div>
      <div className='footer_info'>
        <div>
          <p>{t('footer.ListOfOnlinePaymentBanks')}:</p>
          <img src='https://shopfront-cdn.tekoapis.com/static/vnpay_banks.png' />
        </div>
      </div>
    </div>
  </footer>
  )
}