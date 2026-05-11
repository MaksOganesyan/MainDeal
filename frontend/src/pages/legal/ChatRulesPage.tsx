import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function ChatRulesPage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Правила чата и коммуникации
          </Typography>
          <Typography variant="subtitle2" className="legal-page__date">
            Онлайн-сервиса «DETAIL-DEAL»
          </Typography>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              1. Общая концепция коммуникации
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.1.</strong> Платформа «DETAIL-DEAL» обеспечивает безопасное взаимодействие между Клиентами и Исполнителями в сфере металлообработки. В целях обеспечения безопасности сделок и предотвращения мошенничества, все коммуникации осуществляются исключительно через внутреннего Менеджера Платформы.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.2.</strong> Прямые контакты между Клиентом и Исполнителем до момента официального подтверждения сделки и через инструменты Платформы категорически запрещены.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>1.3.</strong> Менеджер Платформы обладает полномочиями модерации контента, управления чатами и разрешения конфликтных ситуаций.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              2. Порядок работы чатов
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.1.</strong> Диалог создается автоматически при нажатии кнопки «Связаться» в карточке объявления или заказа.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.2.</strong> При инициации чата система отправляет автоматическое сообщение: «Здравствуйте! Менеджер скоро подключится. Опишите дополнительные пожелания, если есть.»
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.3.</strong> Менеджер выступает связующим звеном: он видит карточки обеих сторон, детали заказа и осуществляет передачу сообщений и документов, обеспечивая корректность коммуникации.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>2.4.</strong> История всех сообщений и передаваемых файлов сохраняется в системе без ограничения по времени.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Правила и ограничения безопасности
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>3.1.</strong> Пользователям запрещено передавать в чатах следующую информацию (за исключением случаев, когда это требуется интерфейсом Платформы):
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" className="legal-page__text">
                Номера телефонов и ссылки на мессенджеры (WhatsApp, Telegram и др.);
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                Адреса электронной почты;
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                Ссылки на сторонние ресурсы и социальные сети;
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                Реквизиты для оплаты вне системы «DETAIL-DEAL».
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text">
              <strong>3.2.</strong> На Платформе действует автоматическая система фильтрации контента. При попытке обмена контактными данными сообщение блокируется, а пользователю выводится официальное предупреждение.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Обработка конфликтных ситуаций
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
              Несогласие сторон по условиям
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Менеджер анализирует диалог и карточки, выступает медиатором для достижения компромисса.
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600, mt: 1 }}>
              Попытка обхода Платформы
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Сообщение блокируется, пользователю выносится предупреждение или блокировка.
            </Typography>
            <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600, mt: 1 }}>
              Жалоба на участника
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Автоматическая передача жалобы менеджеру для анализа истории действий и принятия решения.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Модерация и санкции
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>5.1.</strong> Менеджер имеет право применять следующие меры воздействия при нарушении правил коммуникации:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" className="legal-page__text">
                <strong>5.1.1.</strong> Вынесение официального предупреждения в Личном кабинете.
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                <strong>5.1.2.</strong> Временная блокировка доступа к системе чатов.
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                <strong>5.1.3.</strong> Полная блокировка аккаунта и внесение пользователя в «Черный список» (при повторных или грубых нарушениях).
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text">
              <strong>5.2.</strong> Любые изменения в деталях заказа или объявлений после начала коммуникации возможны только через интерфейс с подтверждением Менеджера для предотвращения мошеннических действий.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              6. Технические особенности
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>6.1.</strong> В случае потери соединения в чате, система автоматически сохраняет последнее набранное сообщение. При восстановлении связи чат синхронизируется автоматически.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>6.2.</strong> Все действия пользователей (создание, редактирование, удаление сообщений и объявлений) фиксируются в системном журнале действий для обеспечения прозрачности и безопасности.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              Служба модерации DETAIL-DEAL
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text">
                <strong>Отдел контроля качества коммуникаций</strong>
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Электронная почта для жалоб:</strong> support@detail-deal.ru
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Режим работы менеджеров:</strong> 09:00 — 20:00 (МСК)
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text" sx={{ fontStyle: 'italic', mt: 2 }}>
              * Настоящий регламент обязателен для ознакомления всеми зарегистрированными пользователями Платформы.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
