from .models import DeliveryZone, DeliverySettings


def get_delivery_fee(state, area=''):
    if area:
        try:
            zone = DeliveryZone.objects.get(
                state__iexact=state,
                area__iexact=area,
                is_active=True
            )
            return zone.fee
        except DeliveryZone.DoesNotExist:
            pass

    try:
        zone = DeliveryZone.objects.get(
            state__iexact=state,
            area__isnull=True,
            is_active=True
        )
        return zone.fee
    except DeliveryZone.DoesNotExist:
        pass

    settings_obj = DeliverySettings.objects.first()
    return settings_obj.default_fee if settings_obj else 0