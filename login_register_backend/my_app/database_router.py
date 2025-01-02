class DatabaseRouter:
    def db_for_read(self, model, **hints):
        return model._meta.app_label

    def db_for_write(self, model, **hints):
        return model._meta.app_label

