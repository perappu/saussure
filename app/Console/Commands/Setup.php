<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Console\Command;

class Setup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup command';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $error = null;

        if(User::find(1) == null) {
            $username = $this->ask('Please enter a username for the admin account');
            $email = $this->ask('Please enter an email for the admin account');
            $password = $this->secret('Please enter a password for the admin account');

            try {
                $user = User::create([
                    'name' => $username,
                    'email' => $email,
                    'password' => Hash::make($password),
                ]);

                event(new Registered($user));

            } catch(\Exception $e) {
                $this->error($e->getMessage());
                $error = true;
            }

            if($error == null) {
                $this->info('Admin user created successfully.');
            }
        } else {

            $reset = null;

            while($reset != true) {
                $answer = $this->ask('Admin account has already been created. Would you like to reset the password? (y/n)');
                if($answer == 'y') {
                    $reset = true;
                } elseif ($answer == 'n') {
                    break;
                } else {
                    $this->info('Please answer yes or no.');
                }
            }

            if($reset == true) {
                $password = $this->secret('Please enter a password');

                try {
                    User::find(1)->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                } catch(\Exception $e) {
                    $this->error($e->getMessage());
                    $error = true;
                }

                if($error == null) {
                    $this->info('Password reset successfully.');
                }
                
            } else {
                $this->info('Bye');
            }

        }
    }
}
