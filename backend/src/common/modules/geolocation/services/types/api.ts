// Тип для геометрии (координат) в каждом результате
type Geometry = {
  lat: number; // Широта
  lng: number; // Долгота
};

// Тип для компонентов адреса (город, район, страна и др.)
export type AddressComponents = {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  state_district?: string;
  county?: string;
  country?: string;
  country_code?: string;
  continent?: string;
  postcode?: string;
  road?: string;
  street?: string;
  suburb?: string;
  neighbourhood?: string;
  [key: string]: string | undefined; // Дополнительные компоненты могут быть добавлены API
};

// Тип для аннотаций (например, информация о часовом поясе и пр.)
type Annotations = {
  DMS?: {
    lat: string; // Широта в формате DMS (градусы, минуты, секунды)
    lng: string; // Долгота в формате DMS
  };
  MGRS?: string; // Код MGRS
  Maidenhead?: string; // Локатор Maidenhead
  Mercator?: {
    x: number;
    y: number;
  };
  OSM?: {
    edit_url: string;
    note_url: string;
    url: string;
  };
  callingcode?: number; // Телефонный код страны
  currency?: {
    name: string;
    code: string;
    symbol: string;
    plural: string;
    exchange_rate: number;
  };
  flag?: string; // Эмодзи флага страны
  geohash?: string; // Геохеш
  qibla?: number; // Угол к Кибле
  roadinfo?: {
    drive_on: string;
    road: string;
    speed_in: string;
  };
  timezone?: {
    name: string;
    now_in_dst: number;
    offset_sec: number;
    offset_string: string;
    short_name: string;
  };
  what3words?: {
    words: string; // what3words адрес
  };
  wikidata?: string; // Ссылка на объект Wikidata
};

// Тип для каждого результата в массиве `results`
type OpenCageResult = {
  formatted: string; // Отформатированный адрес
  geometry: Geometry; // Геометрия (координаты)
  components: AddressComponents; // Компоненты адреса (город, страна и т. д.)
  annotations: Annotations; // Аннотации с дополнительной географической информацией
  confidence?: number; // Уровень уверенности API в корректности адреса (от 0 до 10)
};

// Тип для основного ответа от API
export type OpenCageApiResponse = {
  results: OpenCageResult[]; // Массив результатов
  status: {
    code: number; // Код состояния (например, 200 для успешного запроса)
    message: string; // Сообщение о статусе запроса
  };
  total_results: number; // Общее количество результатов
  rate?: {
    limit: number; // Максимальное количество запросов в сутки
    remaining: number; // Оставшееся количество запросов до сброса
    reset: number; // Время сброса лимита (в Unix Timestamp)
  };
  thanks?: string; // Сообщение благодарности
  timestamp?: {
    created_http: string; // Время создания в формате HTTP
    created_unix: number; // Время создания в Unix Timestamp
  };
};
