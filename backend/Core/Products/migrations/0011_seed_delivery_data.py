from django.db import migrations


def seed_delivery_data(apps, schema_editor):
    DeliveryZone = apps.get_model('Products', 'DeliveryZone')
    DeliverySettings = apps.get_model('Products', 'DeliverySettings')

    # clear existing to avoid duplicates
    DeliveryZone.objects.all().delete()
    DeliverySettings.objects.all().delete()

    # Lagos areas
    DeliveryZone.objects.bulk_create([
        DeliveryZone(state='Lagos', city='Ikorodu', fee=6000),
        DeliveryZone(state='Lagos', city='Ikeja', fee=5000),
        DeliveryZone(state='Lagos', city='Ajah', fee=7000),
        DeliveryZone(state='Lagos', city=None, fee=5000),  # Lagos default
    ])

    # Other states
    DeliveryZone.objects.bulk_create([
        DeliveryZone(state='FCT-Abuja', city=None, fee=8000),
        DeliveryZone(state='Kaduna', city=None, fee=8000),
        DeliveryZone(state='Kogi', city=None, fee=9000),
        DeliveryZone(state='Delta', city=None, fee=8000),
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