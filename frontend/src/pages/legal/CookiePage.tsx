import { Box, Container, Paper, Typography } from '@mui/material'
import './LegalPages.css'

export default function CookiePage() {
  return (
    <Box className="legal-page">
      <Container maxWidth="md">
        <Paper className="legal-page__paper" elevation={1}>
          <Typography variant="h4" component="h1" className="legal-page__title">
            Политика в отношении файлов cookie и аналогичных технологий
          </Typography>
          <Typography variant="subtitle2" className="legal-page__date">
            Онлайн-сервиса «DETAIL-DEAL»
          </Typography>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              1. Общие положения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Настоящая Политика в отношении файлов cookie и аналогичных технологий (далее — «Политика») описывает порядок использования файлов cookie, веб-хранилищ браузера (LocalStorage, SessionStorage), веб-маяков (пикселей), SDK-идентификаторов, а также технологий идентификации устройства (в том числе fingerprinting) при использовании онлайн-сервиса «DETAIL-DEAL» (далее — «Сервис»), принадлежащего ООО «DETAIL-DEAL» (далее — «Оператор», «мы»).
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Если используемые технологии позволяют прямо или косвенно идентифицировать Пользователя (далее — «Пользователь»), такие сведения рассматриваются как персональные данные и обрабатываются Оператором в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» (далее — «152-ФЗ»), Федеральным законом от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и о защите информации», а также иными применимыми нормативными актами Российской Федерации.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Необходимые (технические) технологии применяются на основании ст. 6 ч. 1 152-ФЗ, аналитические и маркетинговые технологии — только при наличии предварительного, свободного, конкретного, информированного и осознанного согласия Пользователя (ст. 9 152-ФЗ), собранного через интерфейс баннера/настроек Сервиса.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              2. Термины и применимое право
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>Файл cookie:</strong> Небольшой фрагмент данных, отправляемый Сервисом и сохраняемый на устройстве Пользователя браузером; может считываться при последующих обращениях.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>Аналогичные технологии:</strong> Локальные хранилища браузера (LocalStorage/SessionStorage), пиксели (web beacons), SDK-идентификаторы, а также технологии идентификации устройства (например, device fingerprinting).
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              <strong>Применимое право:</strong> 152-ФЗ; 149-ФЗ; иные подзаконные акты, регулирующие обработку и защиту персональных данных (включая трансграничную передачу, ст. 12 152-ФЗ).
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              3. Правовые основания и цели обработки
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Обработка данных, полученных посредством технологий, осуществляется на следующих основаниях и для следующих целей:
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
                Необходимые (технические)
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Основание:</strong> пп. 2 и 7 ч. 1 ст. 6 152-ФЗ (исполнение договора/оферты с Пользователем; законные интересы Оператора по обеспечению устойчивости и безопасности Сервиса).
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Цели:</strong> обеспечение работы ключевых функций (сессия, авторизация, защита от CSRF, балансировка нагрузки, настройки безопасности).
              </Typography>
            </Box>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
                Функциональные
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Основание:</strong> п. 2 ч. 1 ст. 6 и/или согласие (ст. 9 152-ФЗ) — в зависимости от конкретной функции.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Цели:</strong> сохранение пользовательских предпочтений (язык интерфейса, выбранная роль, фильтры и т.п.).
              </Typography>
            </Box>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
                Аналитические
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Основание:</strong> согласие субъекта персональных данных (ст. 9 152-ФЗ).
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Цели:</strong> измерение аудитории, улучшение производительности и качества Сервиса, устранение ошибок.
              </Typography>
            </Box>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text" sx={{ fontWeight: 600 }}>
                Маркетинговые
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Основание:</strong> согласие субъекта персональных данных (ст. 9 152-ФЗ).
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Цели:</strong> персонализация предложений, оценка эффективности коммуникаций.
              </Typography>
            </Box>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              4. Классификация и сроки хранения
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text">
                <strong>Технические</strong> — авторизация, поддержание сессии, балансировка нагрузки, безопасность запросов (CSRF/Rate-limit). Примеры: dd_auth, dd_csrf, session_id. Срок: сеанс / до 12 мес.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Функциональные</strong> — сохранение настроек интерфейса и предпочтений Пользователя. Примеры: dd_role, ui_lang, ui_filters. Срок: до 12 мес.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Аналитические</strong> — статистика посещаемости, аудит производительности и стабильности. Примеры: dd_consent, perf_markers. Срок: до 25 мес. (при наличии согласия).
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Маркетинговые</strong> — персонализация рекомендаций и коммуникаций. Срок: до отзыва согласия / срок кампании (при наличии согласия).
              </Typography>
            </Box>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              5. Реестр идентификаторов
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              На момент публикации используются следующие идентификаторы. В случае изменения перечня Оператор обновляет настоящий раздел до начала использования соответствующих технологий.
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text">
                <strong>dd_auth</strong> — домен: detaildeal.example, тип: HTTP 1st-party, срок: сеанс / до 12 мес., назначение: авторизация пользователя, поддержание сессии, основание: п. 2 ч. 1 ст. 6 152-ФЗ.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>dd_csrf</strong> — домен: detaildeal.example, тип: HTTP 1st-party, срок: сеанс, назначение: защита от подделки межсайтовых запросов, основание: п. 7 ч. 1 ст. 6 152-ФЗ.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>dd_consent</strong> — тип: JS LocalStorage 1st-party, срок: до 25 мес. / до отзыва, назначение: хранение статуса согласия с категориями cookie, основание: ст. 9 152-ФЗ.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>dd_consent_at</strong> — тип: JS LocalStorage 1st-party, срок: до 25 мес., назначение: отметка времени предоставления/обновления согласия, основание: ст. 9 152-ФЗ.
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>dd_role</strong> — тип: JS LocalStorage 1st-party, срок: до 12 мес., назначение: выбранный режим использования (Клиент/Исполнитель), основание: п. 2 ч. 1 ст. 6 и/или ст. 9 152-ФЗ.
              </Typography>
            </Box>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              6. Управление согласием и настройками
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Пользователь вправе в любой момент изменить или отозвать согласие на использование аналитических и маркетинговых технологий. Это можно сделать через:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" className="legal-page__text">
                интерфейс баннера/центра управления файлами cookie в Сервисе (если доступен) — настройки применяются немедленно;
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                настройки браузера (удаление/блокировка файлов cookie и локальных хранилищ);
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                обращение к Оператору по контактам, указанным в разделе «Реквизиты Оператора».
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text">
              Блокировка необходимых cookie может привести к частичной или полной недоступности функциональности Сервиса. Отзыв согласия не влияет на законность обработки, осуществленной до такого отзыва.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              7. Хранение данных и трансграничная передача
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Первичная обработка и хранение персональных данных, полученных посредством технологий, осуществляется на территории Российской Федерации. Трансграничная передача персональных данных возможна исключительно при соблюдении требований ст. 12 152-ФЗ, при условии обеспечения надлежащей защиты прав субъектов персональных данных и заключения необходимых договоров (включая соглашения о конфиденциальности и обработке данных).
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              8. Права субъектов персональных данных
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Пользователь вправе:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" className="legal-page__text">
                получать информацию, касающуюся обработки его персональных данных Оператором, в том числе сведения о правовых основаниях, целях, способах обработки и сроках хранения;
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                требовать уточнения своих персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки;
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                отозвать ранее данное согласие на обработку персональных данных (если такая обработка осуществляется на основании согласия);
              </Typography>
              <Typography component="li" variant="body1" className="legal-page__text">
                обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке.
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text">
              Оператор рассматривает обращения субъектов персональных данных и направляет ответ в срок, предусмотренный законодательством Российской Федерации (как правило, не позднее 30 календарных дней с даты получения обращения).
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              9. Автоматизированные решения и профилирование
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Оператор не осуществляет принятие решений, порождающих юридические последствия в отношении Пользователя или иным образом существенно затрагивающих его права и законные интересы, исключительно на основании автоматизированной обработки персональных данных, включая профилирование, посредством технологий, указанных в настоящей Политике.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              10. Обновление политики
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция публикуется в Сервисе; дата и номер редакции указываются в заголовке документа. В случае существенных изменений (например, добавление новых категорий технологий или провайдеров) Оператор дополнительно информирует Пользователя и, при необходимости, повторно запрашивает согласие.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              11. Ответственность и ограничения
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Настоящий документ носит информационный характер, определяет условия использования технологий отслеживания в Сервисе и порядок обработки связанных с ними персональных данных. Документ не является публичной офертой в смысле ст. 437 Гражданского кодекса Российской Федерации.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              12. Реквизиты оператора и контакты
            </Typography>
            <Box sx={{ pl: 2, my: 1 }}>
              <Typography variant="body1" className="legal-page__text">
                <strong>Оператор:</strong> ООО «DETAIL-DEAL»
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>ИНН:</strong> [ЗАПОЛНЯЕТСЯ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>ОГРН:</strong> [ЗАПОЛНЯЕТСЯ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Адрес:</strong> [ЗАПОЛНЯЕТСЯ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>E-mail:</strong> privacy@detail-deal.example
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Тел.:</strong> [ЗАПОЛНЯЕТСЯ]
              </Typography>
              <Typography variant="body1" className="legal-page__text">
                <strong>Ответственное лицо (DPO):</strong> [ЗАПОЛНЯЕТСЯ]
              </Typography>
            </Box>
            <Typography variant="body1" className="legal-page__text">
              Настоящая Политика является локальным нормативным актом Оператора и общедоступной информацией о применяемых технологиях и обработке персональных данных. При расхождении русскоязычная версия имеет приоритет. © 2026 DETAIL-DEAL.
            </Typography>
          </Box>

          <Box className="legal-page__section">
            <Typography variant="h5" component="h2" className="legal-page__section-title">
              13. Подпись и утверждение
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Утверждаю: Генеральный директор ООО «DETAIL-DEAL» ________________ / ______________________ / «____» ________________ 2026 г. М.П.
            </Typography>
            <Typography variant="body1" className="legal-page__text">
              Журнал согласия (учет): хранится в информационных системах Оператора в целях доказательства получения согласия и его параметров; срок хранения — до 25 месяцев или до истечения сроков давности по применимым требованиям.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
