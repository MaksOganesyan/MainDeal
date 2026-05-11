import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function OfferPage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Условия оплаты и биллинга
          </Typography>
          <Typography variant="subtitle2" className="legal-page__date">
            Онлайн-сервиса «DETAIL-DEAL»
          </Typography>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              1. Общие положения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.1.</strong> Настоящие Условия оплаты и биллинга (далее — «Условия») являются неотъемлемой частью Публичной оферты (Пользовательского соглашения) и определяют порядок расчетов между Пользователями (Клиентами, Исполнителями) и Оператором Платформы «DETAIL-DEAL» (далее — «Оператор»).
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.2.</strong> Платформа выступает в качестве информационного посредника, предоставляя доступ к программно-аппаратному комплексу для поиска контрагентов и заключения сделок. Оператор не является стороной сделок по металлообработке, заключаемых между Пользователями, если иное не предусмотрено отдельным договором.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.3.</strong> Использование платных сервисов Платформы означает безоговорочное согласие Пользователя с настоящими Условиями.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              2. Сервисное вознаграждение
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.1.</strong> За предоставление права использования функциональных возможностей Платформы, включая услуги по информационному сопровождению, модерации заказов и обеспечению технической поддержки, Оператор взимает сервисную комиссию (далее — «Комиссия»).
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.2.</strong> Размер Комиссии определяется действующими Тарифами Оператора, рассчитывается автоматически в момент формирования заказа или счета и доводится до сведения Пользователя через интерфейс Личного кабинета.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.3.</strong> Оператор вправе в одностороннем порядке изменять Тарифы. Новые Тарифы вступают в силу с момента их публикации на Платформе и не применяются к услугам, оплаченным Пользователем до вступления изменений в силу.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Дополнительные информационные услуги
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>3.1.</strong> Оператор оказывает дополнительные услуги по продвижению объявлений (заказов), в том числе присвоение статуса «Срочное».
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>3.2.</strong> Состав услуги «Срочное» включает: приоритетное ранжирование в результатах поиска на Платформе, визуальное выделение карточки заказа и осуществление адресной рассылки уведомлений потенциальным Исполнителям.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>3.3.</strong> Обязательства Оператора по оказанию услуг продвижения считаются исполненными в полном объеме с момента активации соответствующего функционала в Личном кабинете Пользователя.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Порядок и формы расчетов
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
              Физические лица / Самозанятые
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Оплата банковской картой (МИР, Visa, MasterCard) через платежный шлюз (интернет-эквайринг) или через Систему быстрых платежей (СБП).
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600, mt: 1 }}>
              Юридические лица / ИП
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Безналичный перевод на расчетный счет Оператора на основании выставленного Счета.
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ mt: 2 }}>
              <strong>4.1.</strong> Все услуги предоставляются на условиях 100% (стопроцентной) предоплаты, если иное прямо не предусмотрено специальными условиями договора или интерфейсом Платформы.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>4.2.</strong> Моментом исполнения обязательства Пользователя по оплате считается зачисление денежных средств на расчетный счет Оператора или получение подтверждения от платежной системы об успешной авторизации транзакции.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Учет операций и документооборот
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>5.1.</strong> Учет всех финансовых операций ведется в разделе «Биллинг» Личного кабинета. Данные системы учета Оператора являются достаточным подтверждением объема и стоимости оказанных услуг.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>5.2.</strong> Для юридических лиц и ИП первичные учетные документы (УПД или Акты) формируются ежемесячно не позднее 5 (пятого) числа месяца, следующего за отчетным. Документы направляются через системы электронного документооборота (ЭДО) или на адрес электронной почты, указанный при регистрации.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>5.3.</strong> Услуги считаются принятыми Пользователем в полном объеме и надлежащего качества, если в течение 3 (трех) рабочих дней с даты направления Акта (УПД) от Пользователя не поступило мотивированное письменное возражение.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              6. Безопасность и ограничения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>6.1.</strong> В целях обеспечения безопасности расчетов и предотвращения недобросовестных практик, все переговоры по финансовым условиям сделок должны вестись исключительно во встроенном мессенджере Платформы.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>6.2.</strong> Совершение сделок или осуществление платежей в обход инструментов Платформы является существенным нарушением настоящих Условий и влечет за собой ограничение доступа к Сервису (блокировку аккаунта) без возврата неиспользованного остатка денежных средств.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              7. Ответственность и порядок возврата
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>7.1.</strong> В соответствии со ст. 429.4 ГК РФ (Абонентский договор), денежные средства за предоставленный доступ к функционалу Платформы и информационные услуги возврату не подлежат, вне зависимости от фактического использования Пользователем данных услуг, так как услуга считается оказанной в момент предоставления доступа/активации опции.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>7.2.</strong> В случае технического сбоя на стороне Платформы, препятствующего использованию оплаченных услуг более 24 часов, Оператор производит соразмерное продление срока оказания услуг или начисляет компенсационные баллы на баланс Пользователя.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              Реквизиты оператора платформы
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text">
                <strong>ООО «DETAIL-DEAL»</strong>
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>ИНН / КПП:</strong> [УКАЗЫВАЕТСЯ В СЧЕТЕ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>ОГРН:</strong> [УКАЗЫВАЕТСЯ В СЧЕТЕ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Юридический адрес:</strong> 123112, г. Москва, Пресненская наб., д. 12
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Электронная почта службы поддержки:</strong> billing@detail-deal.ru
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
