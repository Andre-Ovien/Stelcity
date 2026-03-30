from django.contrib import admin
from django.utils import timezone
from .models import User, Newsletter, NewsletterSubscriber
from .emails import send_newsletter_broadcast
from django.contrib import admin

# Register your models here.

admin.site.site_header = "Stelcity Admin"
admin.site.site_title = "Stelcity"
admin.site.index_title = "Welcome to Stelcity Dashboard"

admin.site.register(User)

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_editable = ('is_active',)
    search_fields = ('email',)
    ordering = ('-subscribed_at',)


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('subject', 'is_sent', 'sent_at')
    readonly_fields = ('is_sent', 'sent_at')

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # only send if not already sent
        if not obj.is_sent:
            subscribers = NewsletterSubscriber.objects.filter(is_active=True)
            if subscribers.exists():
                send_newsletter_broadcast(obj, subscribers)
                obj.is_sent = True
                obj.sent_at = timezone.now()
                obj.save()