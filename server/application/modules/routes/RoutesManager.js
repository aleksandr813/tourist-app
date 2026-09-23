const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);
        const testArray = [
        {
            guid: 'a1f3c2e0-0001-4b1a-9c01-000000000001',
            name: 'Кафе «Утро»',
            x: 37.6173,
            y: 55.7558,
            price: 350.0,
            description: 'Небольшое кафе в центре с завтраками и свежим кофе'
        },
        {
            guid: 'a1f3c2e0-0002-4b1a-9c01-000000000002',
            name: 'Пиццерия «Наполи»',
            x: 37.6205,
            y: 55.7530,
            price: 750.5,
            description: 'Итальянская пицца на дровах, есть доставка'
        },
        {
            guid: 'a1f3c2e0-0003-4b1a-9c01-000000000003',
            name: 'Парк «Сокольники»',
            x: 37.6747,
            y: 55.7930,
            price: 0.0,
            description: 'Большой парк с прогулочными аллеями и прудом'
        },
        {
            guid: 'a1f3c2e0-0004-4b1a-9c01-000000000004',
            name: 'Музей современного искусства',
            x: 37.6108,
            y: 55.7415,
            price: 500.0,
            description: 'Выставки современных художников, работает со среды по воскресенье'
        },
        {
            guid: 'a1f3c2e0-0005-4b1a-9c01-000000000005',
            name: 'Смотровая площадка',
            x: 37.5385,
            y: 55.7495,
            price: 1000.0,
            description: 'Панорамный вид на город с высоты 300 метров'
        },
        {
            guid: 'a1f3c2e0-0006-4b1a-9c01-000000000006',
            name: 'Кофейня «Зерно»',
            x: 37.5900,
            y: 55.7300,
            price: 250.0,
            description: 'Спешелти-кофе и десерты собственного производства'
        },
        {
            guid: 'a1f3c2e0-0007-4b1a-9c01-000000000007',
            name: 'Ресторан «Волга»',
            x: 37.6300,
            y: 55.7600,
            price: 1800.0,
            description: 'Русская кухня, банкетные залы, живая музыка по вечерам'
        },
        {
            guid: 'a1f3c2e0-0008-4b1a-9c01-000000000008',
            name: 'Книжный магазин «Глава»',
            x: 37.6050,
            y: 55.7450,
            price: 120.0,
            description: 'Независимый книжный с лекциями и кофе-баром'
        }];

        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
        this.mediator.set(this.TRIGGERS.GET_ROUTES, (data) => this.triggerGetRoutes(data.coords, data.radius));
        this.db.addPlaces('places', testArray);
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    triggerGetRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса
        return this.db.getRoutes(coords, radius);
    }

}

module.exports = RoutesManager;