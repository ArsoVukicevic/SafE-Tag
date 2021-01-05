<?php

namespace App\Http\Controllers\Api;

use App\Constants\DB;
use App\Http\Controllers\Controller;
use App\Service\ImageService;
use App\User;
use Illuminate\Http\Request;

class ImageUploadController extends Controller
{

    public function __construct(Request $request)
    {
        $user = User::join(DB::USER_SESSIONS, 'users.u_id', '=', 'user_sessions.us_u_id')
            ->where('us_token', $request->get('token'))
            ->whereNull('us_enddt')
            ->first();

        if (!$user) {
            throw new \Exception('User is not authenticated! Please login first!');
        }
    }

    public function UploadAction(Request $request)
    {
        $imageService = new ImageService();

        $files = $request->file('file');
        foreach ($files as $file) {
            $imageService->save($file->path(), $file->getClientOriginalName());
        }

        return response()->api(true);
    }
}
