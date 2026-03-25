from .models import DeliveryZone, DeliverySettings


def get_delivery_fee(state, city=''):
    if city:
        try:
            zone = DeliveryZone.objects.get(
                state__iexact=state,
                city__iexact=city,
                is_active=True
            )
            return zone.fee
        except DeliveryZone.DoesNotExist:
            pass

    try:
        zone = DeliveryZone.objects.get(
            state__iexact=state,
            city__isnull=True,
            is_active=True
        )
        return zone.fee
    except DeliveryZone.DoesNotExist:
        pass

    settings_obj = DeliverySettings.objects.first()
    return settings_obj.default_fee if settings_obj else 0