class DbRouter(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'socializer-user':
            return 'socializer-user'
        elif model._meta.app_label == 'socializer-activity':
            return 'socializer-activity'
        elif model._meta.app_label == 'socializer-order':
            return 'socializer-order'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'socializer-user':
            return 'socializer-user'
        elif model._meta.app_label == 'socializer-activity':
            return 'socializer-activity'
        elif model._meta.app_label == 'socializer-order':
            return 'socializer-order'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_syncdb(self, db, model):
        if db in ['socializer-user', 'socializer-activity', 'socializer-order'] \
                or model._meta.app_label in ['socializer-user',
                                             'socializer-activity', 'socializer-order']:
            return False  # we're not using syncdb on our legacy database
        else:  # but all other models/databases are fine
            return True
