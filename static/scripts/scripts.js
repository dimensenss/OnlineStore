document.addEventListener("DOMContentLoaded", function () {
    var loaderWrapper = document.getElementById("loader-wrapper");
    if (loaderWrapper) {
        loaderWrapper.style.display = "none";
    }
});

$(document).ready(function ($) {
    var successMessage = $("#jq-notification");
    var notification = $('#notification');
    var warning_notification = $('#warning-jq-notification');

    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');

        }, 3000);
    }


    // Ловим собыитие клика по кнопке добавить в корзину
    $(document).on("click", ".add-to-cart", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // var selectedSize = $(".form-select").val();
        //
        // // Проверяем, что цвет и размер выбраны
        // if (selectedSize === '') {
        //     // Если не все параметры выбраны, вы можете вывести сообщение пользователю или просто вернуться
        //     warning_notification.html('Оберіть розмір');
        //     warning_notification.fadeIn(400);
        //     setTimeout(function () {
        //         warning_notification.fadeOut(400);
        //     }, 1500);
        //     return;
        // }


        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInCartCount = $(".goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.first().text() || 0); // Выбираем первый элемент

        // Получаем id товара из атрибута data-product-id
        var product_id = $(this).data("product-id");
        // Из атрибута href берем ссылку на контроллер django
        var add_to_cart_url = $(this).attr("href");
        var is_order = $(this).data("is-order");


        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                // size: selectedSize,
                is_order: is_order,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 1500);

                // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                cartCount++;
                goodsInCartCount.text(cartCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $(".cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

                if (is_order) {
                    var createOrderUrl = data.create_order_url;
                    window.location.href = createOrderUrl;
                }

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });


    // Ловим собыитие клика по кнопке удалить товар из корзины
    $(document).on("click", ".remove-from-cart", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInCartCount = $(".goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.first().text() || 0); // Выбираем первый элемент

        // Получаем id корзины из атрибута data-cart-id
        var cart_id = $(this).data("cart-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_cart = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 1500);

                // Уменьшаем количество товаров в корзине (отрисовка)
                cartCount -= data.quantity_deleted;
                goodsInCartCount.text(cartCount);


                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $(".cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });

    var isUpdatingCart = false; // Флаг, который указывает, идет ли в данный момент процесс обновления корзины

    function updateCart(cartID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                cart_id: cartID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },

            success: function (data) {
                // Сообщение

                // Изменяем количество товаров в корзине
                var goodsInCartCount = $(".goods-in-cart-count");
                var cartCount = parseInt(goodsInCartCount.first().text() || 0); // Выбираем первый элемент
                cartCount += change;
                goodsInCartCount.text(cartCount);

                // Меняем содержимое корзины
                var cartItemsContainer = $(".cart-items-container");
                cartItemsContainer.html(data.cart_items_html);


            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    }

    $(document).on("input", ".number", function () {
        if (!isUpdatingCart) {
            isUpdatingCart = true;

            var url = $(this).closest('.input-group').find('.increment').data("cart-change-url");
            var cartID = $(this).closest('.input-group').find('.increment').data("cart-id");
            var quantity = parseInt($(this).val());

            // Проверяем, что количество находится в допустимом диапазоне
            if (quantity >= 1 && quantity <= 9999) {
                updateCart(cartID, quantity, quantity - parseInt($(this).attr('value')), url);

                // Устанавливаем задержку (при необходимости)
                setTimeout(function () {
                    isUpdatingCart = false;
                }, 200);
            } else {
                // Возвращаем предыдущее значение в случае недопустимого количества
                $(this).val(parseInt($(this).attr('value')));
                isUpdatingCart = false;
            }
        }
    });

    $(document).on("click", ".decrement", function () {
        if (!isUpdatingCart) {
            isUpdatingCart = true;

            var url = $(this).data("cart-change-url");
            var cartID = $(this).data("cart-id");
            var $input = $(this).closest('.input-group').find('.number');
            var currentValue = parseInt($input.val());

            if (currentValue > 1) {
                $input.val(currentValue - 1);
                updateCart(cartID, currentValue - 1, -1, url);
            }

            setTimeout(function () {
                isUpdatingCart = false;
            }, 200);
        }
    });

    $(document).on("click", ".increment", function () {
        if (!isUpdatingCart) {
            isUpdatingCart = true;

            var url = $(this).data("cart-change-url");
            var cartID = $(this).data("cart-id");
            var $input = $(this).closest('.input-group').find('.number');
            var currentValue = parseInt($input.val());

            $input.val(currentValue + 1);
            updateCart(cartID, currentValue + 1, 1, url);

            setTimeout(function () {
                isUpdatingCart = false;
            }, 200);
        }
    });

    const stars = document.querySelectorAll('.star');
    const select = document.getElementById('id_rate');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            select.value = value.toString();
            highlightStars(value);
        });
    });

    function highlightStars(value) {
        stars.forEach((star, index) => {
            if (index < value) {
                star.style.color = 'gold';
            } else {
                star.style.color = 'black';
            }
        });
    }

    select.addEventListener('change', () => {
        const value = parseInt(select.value);
        highlightStars(value);
    });
});
