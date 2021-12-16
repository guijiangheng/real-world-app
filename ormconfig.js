const configs = {};

if (process.env.NODE_ENV === 'test') {
  Object.assign(configs, {
    type: 'better-sqlite3',
    database: ':memory:',
    synchronize: true,
    entities: ['src/**/*.entity.ts'],
  });
} else if (process.env.NODE_ENV === 'development') {
  Object.assign(configs, {
    type: 'better-sqlite3',
    database: 'development.sqlite',
    synchronize: true,
    entities: ['dist/**/*.entity.js'],
  });
}

module.exports = configs;
