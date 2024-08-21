const gulp = require('gulp');

gulp.task('help', (done) => {
  const tasksToExclude = ['build', 'default', 'help', 'production', 'test'];
  const taskNames = Object.keys(gulp.registry().tasks())
    .filter(taskName => !tasksToExclude.includes(taskName));

  console.log('Available tasks:');
  taskNames.forEach(taskName => {
    console.log(`- ${taskName}`);
  });
  
  done();
});
