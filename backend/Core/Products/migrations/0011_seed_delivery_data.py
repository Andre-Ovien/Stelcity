from django.db import migrations


def seed_delivery_data(apps, schema_editor):
    DeliveryZone = apps.get_model('Products', 'DeliveryZone')
    DeliverySettings = apps.get_model('Products', 'DeliverySettings')

    # clear existing to avoid duplicates
    DeliveryZone.objects.all().delete()
    DeliverySettings.objects.all().delete()

    # Lagos areas
    DeliveryZone.objects.bulk_create([
        DeliveryZone(state='Lagos', area='Ikorodu', fee=6000),
        DeliveryZone(state='Lagos', area='Ikeja', fee=5000),
        DeliveryZone(state='Lagos', area='Ajah', fee=7000),
        DeliveryZone(state='Lagos', area=None, fee=5000),  # Lagos default
    ])

    # Other states
    DeliveryZone.objects.bulk_create([
        DeliveryZone(state='Abuja', area=None, fee=8000),
        DeliveryZone(state='Kaduna', area=None, fee=8000),
        DeliveryZone(state='Lokoja', area=None, fee=9000),
        DeliveryZone(state='Delta', area=None, fee=8000),
    ])

    # global default for unlisted states
    DeliverySettings.objects.create(default_fee=7000)


def reverse_seed(apps, schema_editor):
    DeliveryZone = apps.get_model('Products', 'DeliveryZone')
    DeliverySettings = apps.get_model('Products', 'DeliverySettings')
    DeliveryZone.objects.all().delete()
    DeliverySettings.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0010_alter_ordertracking_status'),  
    ]

    operations = [
        migrations.RunPython(seed_delivery_data, reverse_seed),
    ]