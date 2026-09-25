const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);
        const testRoutes = [
            {
                guid: 'r-0001',
                cost: 1500,
                title: 'Центр Москвы',
                x: 37.6173,
                y: 55.7558
            },
            {
                guid: 'r-0002',
                cost: 2000,
                title: 'По набережным Питера',
                x: 30.3141,
                y: 59.9386
            },
            {
                guid: 'r-0003',
                cost: 800,
                title: 'Казанский кремль',
                x: 49.1064,
                y: 55.7963
            },
            {
                guid: 'r-0004',
                cost: 0,
                title: 'Прогулка по Сочи',
                x: 39.7303,
                y: 43.6028
            },
            {
                guid: 'r-0005',
                cost: 1200,
                title: 'Екатеринбург: конструктивизм',
                x: 60.5975,
                y: 56.8389
            }
        ];
        const testPlaces = [
            {
                guid: 'p-0001',
                name: 'Кафе «Утро»',
                x: 37.6173,
                y: 55.7558,
                price: 350.0,
                description: 'Небольшое кафе в центре с завтраками и свежим кофе',
                route_guid: 'r-0001'
            },
            {
                guid: 'p-0002',
                name: 'Пиццерия «Наполи»',
                x: 37.6205,
                y: 55.7530,
                price: 750.5,
                description: 'Итальянская пицца на дровах, есть доставка',
                route_guid: 'r-0001'
            },
            {
                guid: 'p-0003',
                name: 'Парк «Сокольники»',
                x: 37.6747,
                y: 55.7930,
                price: 0.0,
                description: 'Большой парк с прогулочными аллеями и прудом',
                route_guid: 'r-0001'
            },
            {
                guid: 'p-0004',
                name: 'Музей современного искусства',
                x: 37.6108,
                y: 55.7415,
                price: 500.0,
                description: 'Выставки современных художников, работает со среды по воскресенье',
                route_guid: 'r-0001'
            },
            {
                guid: 'p-0005',
                name: 'Смотровая площадка',
                x: 37.5385,
                y: 55.7495,
                price: 1000.0,
                description: 'Панорамный вид на город с высоты 300 метров',
                route_guid: 'r-0002'
            },
            {
                guid: 'p-0006',
                name: 'Кофейня «Зерно»',
                x: 37.5900,
                y: 55.7300,
                price: 250.0,
                description: 'Спешелти-кофе и десерты собственного производства',
                route_guid: 'r-0002'
            },
            {
                guid: 'p-0007',
                name: 'Ресторан «Волга»',
                x: 37.6300,
                y: 55.7600,
                price: 1800.0,
                description: 'Русская кухня, банкетные залы, живая музыка по вечерам',
                route_guid: 'r-0003'
            },
            {
                guid: 'p-0008',
                name: 'Книжный магазин «Глава»',
                x: 37.6050,
                y: 55.7450,
                price: 120.0,
                description: 'Независимый книжный с лекциями и кофе-баром',
                route_guid: 'r-0004'
            }
        ];
        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
        this.mediator.set(this.TRIGGERS.GET_ROUTES, (data) => this.triggerGetRoutes(data.coords, data.radius));
        this.db.addPlaces('places',testPlaces);
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    triggerGetRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса
        return this.db.getRoutes(coords, radius);
    }

}

module.exports = RoutesManager;